const mongoose = require('mongoose');

const advancePaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    advanceAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const advancePaymentModel = mongoose.model(
  'advancePayment',
  advancePaymentSchema
);
module.exports = advancePaymentModel;
