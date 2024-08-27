// src/models/user.model.js
const mongoose = require("mongoose");

const MarketPlaceSchema = new mongoose.Schema(
  {
    marketPlace: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const MarketPlaceModel = mongoose.model("MarketPlace", MarketPlaceSchema);

module.exports = MarketPlaceModel;
