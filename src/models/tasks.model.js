const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    taskId: { type: Number, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    department: { type: String, required: true },
    description: { type: String, required: true },
    taskStartDate: { type: String, required: true },
    taskDeadline: { type: String, required: true },
    status: { type: String, required: true },
    taskTimer: { type: String, required: true },
    taskResource: {
      url: { type: String, required: true },
      view: { type: String, required: false },
    },
    taskCreator: {
      designation: { type: String, required: true, default: 'Coordinator' },
      userId: { type: String, required: true },
      name: { type: String, required: true },
    },
    taskReceiver: {
      designation: { type: String, required: true, default: 'Employee' },
      userId: { type: String, required: true },
      name: { type: String, required: true },
    },
    approvalChain: [
      {
        designation: { type: String },
        userId: { type: String },
        name: { type: String },
        status: { type: String, default: 'Pending' },
        approvedDate: { type: Date, default: null },
        comments: { type: String, default: '' },
      },
    ],
    submitInfo: [
      {
        Note: { type: String },
        fileUrl: { type: String },
        uploadedBy: { type: String },
        uploadDate: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Default empty array for approvalChain and submitInfo
taskSchema.path('approvalChain').default([]);
taskSchema.path('submitInfo').default([]);

const TaskModel = mongoose.model('Tasks', taskSchema);

module.exports = TaskModel;
