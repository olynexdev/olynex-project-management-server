// src/models/user.model.js
const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const DepartmentModel = mongoose.model("Department", DepartmentSchema);

module.exports = DepartmentModel;
