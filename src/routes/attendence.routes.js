const express = require('express');
const { getAllAttendances } = require('../controllers/addendence/attendence.controller');
const router = express.Router();

// attendence related routes
router.get('/get-attendence', getAllAttendances);

module.exports = router;
