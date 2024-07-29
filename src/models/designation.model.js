// src/models/user.model.js
const mongoose = require('mongoose');

const DesignationSchema = new mongoose.Schema({
  designation: {
    type: String,
    required: true,
  },
}, 
{ timestamps: true }
);

const DesignationModel = mongoose.model('Designation', DesignationSchema);

module.exports = DesignationModel;
