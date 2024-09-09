const mongoose = require("mongoose");

const ProjectImagesSchema = new mongoose.Schema(
  {
    taskReceiver: {
      userId: { type: Number },
      name: { type: String },
    },
    taskId: {
      type: Number,
      required: true,
    },
    images: Array,
  },
  { timestamps: true }
);

const ProjectImagesModal = mongoose.model(
  "Project-images",
  ProjectImagesSchema
);

module.exports = ProjectImagesModal;
