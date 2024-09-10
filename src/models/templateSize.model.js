const mongoose = require('mongoose');

const templateSizeSchema = new mongoose.Schema(
  {
    size: {
      type: [],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const templateSizeModel = mongoose.model('template-size', templateSizeSchema);
module.exports = templateSizeModel;
