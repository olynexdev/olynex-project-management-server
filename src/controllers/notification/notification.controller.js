const NotificationModel = require('../../models/notification.model');

exports.addNotification = async (req, res) => {
  const body = req.body; // req to frontend
  try {
    // add new notification
    const result = await NotificationModel.create(body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Task Adding Error!', error });
  }
};
