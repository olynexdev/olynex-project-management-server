const TaskModel = require('../models/tasks.model');
const UserModel = require('../models/users.model');

const verifyTaskAccess = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    const email = req.user?.email;

    if (!token) {
      return res.status(401).send({ message: 'Unauthorized access' });
    }

    if (email) {
      // Find user by email
      const user = await UserModel.findOne({ officeEmail: email });

      if (!user) {
        return res.status(401).send({ message: 'Unauthorized access' });
      }

      const userId = user.userId;

      const task = await TaskModel.findById(
        req.params?.id || req.params?.userId
      );

      if (!task) {
        return res.status(404).send({ message: 'Task not found' });
      }

      // user validation in different way
      const isAuthorized =
        task.taskCreator.userId === userId ||
        task.taskReceiver.userId === userId ||
        task.approvalChain.some(approver => approver.userId === userId) ||
        user?.personalInfo?.designation === 'mockup'
        ;

      if (isAuthorized) {
        console.log(
          `User ${userId} is authorized to access task ${task.taskId}`
        );
        next();
      } else {
        return res
          .status(403)
          .send({ message: 'Forbidden: You do not have access to this task' });
      }
    } else {
      return res.status(401).send({ message: 'Unauthorized access' });
    }
  } catch (error) {
    console.error('Error in verifyTaskAccess middleware:', error);
    return res.status(500).send({ message: 'Internal server error' });
  }
};

module.exports = verifyTaskAccess;
