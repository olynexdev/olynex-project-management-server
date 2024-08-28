const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    taskId: { type: String },
    receiverId: { type: Number, required: true },
    senderId: { type: Number, required: true },
    senderProfile: { type: String, require: true },
    notificationType: { type: String },
    text: { type: String, required: true },
    isRead: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model('notifications', notificationSchema);

module.exports = NotificationModel;
