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
  const userId = req.params.id;

  const { offset = 0, limit = 10 } = req.query;

  try {
    // Convert offset and limit to numbers
    const offsetNumber = parseInt(offset, 10);
    const limitNumber = parseInt(limit, 10);

    // Calculate total number of notifications
    const totalNotifications = await NotificationModel.countDocuments({
      receiverId: userId,
    });
    const totalPages = Math.ceil(totalNotifications / limitNumber);

    // Fetch notifications with pagination
    const notifications = await NotificationModel.find({ receiverId: userId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(offsetNumber)
      .limit(limitNumber)
      .exec();

    const nextOffset =
      offsetNumber + limitNumber < totalNotifications
        ? offsetNumber + limitNumber
        : undefined;

    res.status(200).send({
      notifications,
      nextOffset,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message,
    });
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
    const result = await NotificationModel.deleteMany({ receiverId: id }); // Delete all for user
    return res.status(201).send(result);
  }
};
