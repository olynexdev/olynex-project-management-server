const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    taskId: { type: Number, required: true },
    taskReceiverId: { type: Number, required: true },
    taskSenderId: { type: Number, required: true },
    text: { type: String, required: true },
    isRead: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model('notifications', notificationSchema);

module.exports = NotificationModel;
