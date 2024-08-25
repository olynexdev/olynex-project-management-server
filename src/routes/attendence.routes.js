const express = require('express');
const {
  getAllAttendances,
  deleteAllAttendance,
  postAttendance,
  updateAttendance,
  editAttendance,
} = require('../controllers/addendence/attendence.controller');
const router = express.Router();

// attendence related routes
router.get('/get-attendence', getAllAttendances);
router.delete('/delete-all-attendance', deleteAllAttendance);
router.post('/post-attendance', postAttendance);
router.patch('/update-attendance/:id', updateAttendance);
router.patch('/edit-attendance/:id', editAttendance);

module.exports = router;
