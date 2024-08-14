const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    taskId: { type: String, required: true },
    taskReceiverId: { type: Number, required: true },
    taskSenderId: { type: Number, required: true },
    taskSenderProfile: { type: String, require: true },
    text: { type: String, required: true },
    isRead: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model('notifications', notificationSchema);

module.exports = NotificationModel;
