const express = require('express');
const {
  getAllAttendances,
  deleteAllAttendance,
  postAttendance,
  updateAttendance,
  editAttendance,
  getAttendanceWithUserId,
  attendanceCounts,
  deleteAttendance,
} = require('../controllers/addendence/attendence.controller');
const verifyToken = require('../middlewares/verifyToken');
const verifyHr = require('../middlewares/verifyHr');
const { todayAttendanceCount } = require('../controllers/addendence/todayAttendanceCount.controller');
const router = express.Router();

// attendence related routes
router.get('/get-attendence', verifyToken, verifyHr, getAllAttendances);
router.delete('/delete-all-attendance', verifyToken, deleteAllAttendance);
router.post('/post-attendance', verifyToken, postAttendance);
router.patch('/update-attendance/:id', verifyToken, updateAttendance);
router.patch('/edit-attendance/:id', verifyToken, editAttendance);
router.get('/get-attendance-by-user-id', verifyToken, getAttendanceWithUserId);
router.get('/get-attendance-count/:month', verifyToken, attendanceCounts);
router.delete('/delete-attendance/:id', verifyToken, deleteAttendance);
router.get("/get-today-attendance", verifyToken, verifyHr, todayAttendanceCount)

module.exports = router;
