const cron = require('node-cron');
const TaskModel = require('../models/tasks.model');
const NotificationModel = require('../models/notification.model');
const UserModel = require('../models/users.model');

const schedulePendingTaskCheck = io => {
  cron.schedule('* * * * *', async () => {
    try {
      // Find tasks where the status is still pending
      const pendingTasks = await TaskModel.find({
        'approvalChain.status': 'pending',
      });

      // Iterate over each pending task
      for (const task of pendingTasks) {
        const findEmployee = task.approvalChain.find(
          user => user.designation === 'employee'
        );
        const userProfile = await UserModel.find({
          userId: findEmployee.userId,
        });

        if (findEmployee) {
          // Prepare the notification
          const notificationInfo = {
            taskId: task._id,
            senderId: findEmployee.userId,
            senderProfile: userProfile[0]?.userProfile,
            receiverId: task.taskCreator.userId,
            text: `${findEmployee.name} has not accepted the task ${task.taskId} yet!`,
            isRead: false,
          };

          // Save the notification to the database
          const notification = new NotificationModel(notificationInfo);
          await notification.save();

          // Emit the notification using Socket.IO
          if (io) {
            // Emit the notification using Socket.IO
            io.to(notificationInfo.receiverId).emit(
              'receiveNotification',
              notificationInfo
            );
            console.log('Notification sent:', notificationInfo);
          } else {
            console.error('Socket.io instance is not defined.');
          }
        }
      }
    } catch (error) {
      console.error('Error running cron job for task notifications:', error);
    }
  });
};

module.exports = schedulePendingTaskCheck;
