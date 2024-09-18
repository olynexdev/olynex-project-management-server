const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    taskId: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    categoryNumber: { type: Number, require: true },
    department: { type: String, required: true },
    description: { type: String},
    colorSpace: { type: String, required: true },
    pages: { type: String, required: true },
    size: [],
    taskStartDate: { type: String, required: true },
    file_types: [],
    keywords: { type: String, required: true },
    taskDeadline: { type: String, required: true },
    status: { type: String, required: true },
    taskTimer: { type: String },
    starPoint: { type: Number },
    taskResource: {
      url: { type: String},
      view: { type: Boolean, required: false },
    },
    taskCreator: {
      designation: { type: String, required: true },
      userId: { type: Number, required: true },
      name: { type: String, required: true },
    },
    taskReceiver: {
      designation: { type: String, required: true },
      userId: { type: Number, required: true },
      name: { type: String, required: true },
    },
    approvalChain: [
      {
        designation: { type: String },
        userId: { type: Number },
        name: { type: String },
        status: { type: String },
        date: { type: Date, default: null },
        comment: { type: String, default: '' },
      },
    ],
    submitInfo: [
      {
        note: { type: String },
        uploadedBy: { type: String },
        uploadDate: { type: String },
      },
    ],
    rejectInfo: [
      {
        designation: { type: String },
        userId: { type: Number },
        rejectNote: { type: String },
        rejectReceiver: { type: Number },
        rejectDate: { type: String },
      },
    ],
    uploadInfo: {
      note: { type: String },
      userId: { type: Number },
      name: { type: String },
      marketPlaces: Array,
      uploadDate: { type: String },
    },
  },
  { timestamps: true }
);

// Default empty array for approvalChain and submitInfo
taskSchema.path('approvalChain').default([]);
taskSchema.path('submitInfo').default([]);
taskSchema.path('rejectInfo').default([]);

const TaskModel = mongoose.model('Tasks', taskSchema);

module.exports = TaskModel;
