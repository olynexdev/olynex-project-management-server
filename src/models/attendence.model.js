const mongoose = require('mongoose');

const attendenceScema = new mongoose.Schema(
  {
    deviceUserId: {
      type: Number,
      required: true,
    },
    recordTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AddendenceModel = mongoose.model('Addentence', attendenceScema);
module.exports = AddendenceModel;
