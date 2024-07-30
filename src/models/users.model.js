const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  nickName: { type: String },
  userProfile: { type: String },
  officeEmail: { type: String, required: true },
  userEmail: { type: String },
  userId: { type: Number, required: true, unique: true },
  personalInfo: {
    userType: { type: String },
    userPhoneNumber: { type: Number },
    dateOfBirth: { type: Date },
    NIDNo: { type: Number },
    maritalStatus: { type: String },
    gender: { type: String },
    department: { type: String },
    designation: { type: String },
    salary: { type: Number },
    joinDate: { type: Date },
  },
  educationInfo: {
    universityName: { type: String },
    universityDepartment: { type: String },
    session: { type: String },
    passingYear: { type: Date },
  },
  experience: {
    nameOfOrganization: { type: String },
    experienceDesignation: { type: String },
    experience: { type: String }, 
    workTime: { type: String }, 
  },
  presentAddress: {
    presentVillage: { type: String },
    presentUpazila: { type: String },
    presentDistrict: { type: String },
    presentDivision: { type: String },
  },
  permanentAddress: {
    permanentVillage: { type: String },
    permanentUpazila: { type: String },
    permanentDistrict: { type: String },
    permanentDivision: { type: String },
  },
  bankInfo: {
    accountNumber: { type: Number },
    accountHolder: { type: String },
    bankName: { type: String },
    accountMobileNumber: { type: Number },
    branch: { type: String },
    accountDistrict: { type: String },
  },
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
