// src/models/user.model.js
const mongoose = require("mongoose");

const TaskMarketPlaceSchema = new mongoose.Schema(
  {
    taskId: {
      type: Number,
      required: true,
    },
    marketPlaces: [
      {
        marketPlace: { type: String, required: true },
        details: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const TaskMarketPlaceModel = mongoose.model(
  "Task-market-place",
  TaskMarketPlaceSchema
);

module.exports = TaskMarketPlaceModel;
