const mongoose = require('mongoose');

const attendenceScema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    inGoing: {
      type: String,
    },
    outGoing: {
      type: String,
    },
    OfficeWorking: {
      type: String,
      required: true,
      
    },
    note:{
      note: String,

    }
  },
  {
    timestamps: true,
  }
);

const AddendenceModel = mongoose.model('Attendance', attendenceScema);
module.exports = AddendenceModel;
