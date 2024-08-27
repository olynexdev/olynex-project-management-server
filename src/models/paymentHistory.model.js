const mongoose = require("mongoose");

const paymentHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: Number,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    officeHours: {
      type: String,
      required: true,
    },
    overTimes: {
      type: String,
      required: true,
    },
    advancePayment: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    workingDay: {
      type: Number,
      required: true,
    },
    monthRang: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const paymentHIstoryModal = mongoose.model(
  "payment-history",
  paymentHistorySchema
);
module.exports = paymentHIstoryModal;
