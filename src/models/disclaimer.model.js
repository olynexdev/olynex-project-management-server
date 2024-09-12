
const mongoose = require("mongoose");

const DisclaimerSchema = new mongoose.Schema(
  {
    disclaimer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const DisclaimerModel = mongoose.model("Disclaimer", DisclaimerSchema);

module.exports = DisclaimerModel;
