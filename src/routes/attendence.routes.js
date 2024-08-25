const express = require('express');
const { getAllAttendances, deleteAllAttendance, postAttendance, postAbsentAttendance } = require('../controllers/addendence/attendence.controller');
const router = express.Router();

// attendence related routes
router.get('/get-attendence', getAllAttendances);
router.delete("/delete-all-attendance", deleteAllAttendance)
router.post("/post-attendance", postAttendance)
router.post("/post-absent", postAbsentAttendance)
module.exports = router;
