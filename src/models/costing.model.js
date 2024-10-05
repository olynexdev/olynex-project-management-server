const mongoose = require('mongoose');

const costingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    item: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CostingModel = mongoose.model('Costing', costingSchema);
module.exports = CostingModel;
