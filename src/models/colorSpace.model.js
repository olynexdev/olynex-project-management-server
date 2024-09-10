const mongoose = require('mongoose');

const colorSpaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const colorSpaceModel = mongoose.model('color-space', colorSpaceSchema);
module.exports = colorSpaceModel;
