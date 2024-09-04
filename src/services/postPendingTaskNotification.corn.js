const cron = require('node-cron');
const TaskModel = require('../models/tasks.model');
const NotificationModel = require('../models/notification.model');
const UserModel = require('../models/users.model');

// In-memory store for tracking next notification times
const nextNotificationTimes = {};

// Schedule a cron job to run every minute
const schedulePendingTaskCheck = io => {
  cron.schedule('* * * * *', async () => {
    const intervalMillis = 10 * 60000; // 10 minutes

    // Prevent overlapping executions
    if (schedulePendingTaskCheck.lock) return;
    schedulePendingTaskCheck.lock = true;

    try {
      // Find tasks with pending status in the approval chain
      const pendingTasks = await TaskModel.find({
        approvalChain: {
          $elemMatch: {
            status: 'pending',
            designation: 'employee',
          },
        },
      });

      // Process each pending task
      for (const task of pendingTasks) {
        const createdAt = new Date(task.createdAt).getTime();
        const now = Date.now();
        const taskId = task._id.toString();

        // Initialize next notification time if not set
        if (!nextNotificationTimes[taskId]) {
          nextNotificationTimes[taskId] = createdAt + intervalMillis;
        }

        const nextNotificationTime = nextNotificationTimes[taskId];

        // Send notification if the current time exceeds the next notification time
        if (now >= nextNotificationTime) {
          const findEmployee = task.approvalChain.find(
            user => user.designation === 'employee'
          );
          const userProfile = await UserModel.findOne({
            userId: findEmployee.userId,
          });

          if (findEmployee) {
            // Create notification info
            const notificationInfo = {
              taskId: task._id,
              senderId: findEmployee.userId,
              senderProfile: userProfile?.userProfile,
              receiverId: task.taskCreator.userId,
              text: `${findEmployee.name} has not accepted the task ${task.taskId} yet!`,
              isRead: false,
            };

            // Save notification to database
            const notification = new NotificationModel(notificationInfo);
            await notification.save();

            // Emit notification via Socket.IO
            if (io) {
              io.to(notificationInfo.receiverId).emit(
                'receiveNotification',
                notificationInfo
              );
            }

            // Update next notification time
            nextNotificationTimes[taskId] = now + intervalMillis;
          }
        }
      }
    } catch (error) {
      console.error('Error running cron job for task notifications:', error);
    } finally {
      // Release the lock
      schedulePendingTaskCheck.lock = false;
    }
  });
};

module.exports = schedulePendingTaskCheck;
