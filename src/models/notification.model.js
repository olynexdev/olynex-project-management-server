const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    taskId: { type: String, required: true },
    receiverId: { type: Number, required: true },
    senderId: { type: Number, required: true },
    senderProfile: { type: String, require: true },
    text: { type: String, required: true },
    isRead: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model('notifications', notificationSchema);

module.exports = NotificationModel;
