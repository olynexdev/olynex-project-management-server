const NotificationModel = require('../../models/notification.model');

// Add a new notification
exports.addNotification = async (req, res) => {
  const body = req.body; // Data from frontend
  try {
    const result = await NotificationModel.create(body); // Create notification
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Could not post notification!', error });
  }
};

// Get notifications for a specific user
exports.getNotification = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await NotificationModel.find({ taskReceiverId: id })
      .sort({ createdAt: -1 }) // Sort by newest first
      .exec();
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Cannot get notification!', error });
  }
};

// Mark a notification as read
exports.updateReadNotification = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await NotificationModel.updateOne(
      { _id: id }, // Find by ID
      { isRead: true } // Set isRead to true
    );
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: 'Cannot read notification!', error });
  }
};

// Delete notifications based on operation type
exports.deleteNotification = async (req, res) => {
  const id = req.params.id;
  const operation = req.query.operation;

  if (operation === 'singleDelete') {
    const result = await NotificationModel.deleteOne({ _id: id }); // Delete single
    return res.status(201).send(result);
  }

  if (operation === 'allDelete') {
    const result = await NotificationModel.deleteMany({ taskReceiverId: id }); // Delete all for user
    return res.status(201).send(result);
  }
};
