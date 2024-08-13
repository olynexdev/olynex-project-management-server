const NotificationModel = require('../../models/notification.model');

// post notification
exports.addNotification = async (req, res) => {
  const body = req.body; // req to frontend
  try {
    // add new notification
    const result = await NotificationModel.create(body);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Could not post notification!', error });
  }
};

// get notification
exports.getNotification = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await NotificationModel.find({
      taskReceiverId: id,
    })
      .sort({
        createdAt: -1,
      })
      .exec();
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Cannot get notification!', error });
  }
};
