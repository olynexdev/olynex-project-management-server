const express = require('express');
const {
  postLeaveRequest,
  getLeaveRequests,
  responseLeaveRequest,
  getLeaveRequest,
} = require('../controllers/leaveRequest/leaveRequest.controller');
const verifyToken = require('../middlewares/verifyToken');
const verifyHr = require('../middlewares/verifyHr');
const router = express.Router();

// leave requst CRUD
router.post('/post-leave-request', verifyToken, postLeaveRequest);
router.get('/get-leave-requests', verifyToken, verifyHr, getLeaveRequests);
router.get('/get-leave-request/:id', verifyToken, getLeaveRequest);
router.put('/leave-request-respons/:id', verifyToken, responseLeaveRequest);

module.exports = router;
