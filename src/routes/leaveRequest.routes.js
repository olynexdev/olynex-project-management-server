const express = require("express");
const { postLeaveRequest, getLeaveRequests } = require("../controllers/leaveRequest/leaveRequest.controller");
const router = express.Router();

// leave requst CRUD
router.post("/post-leave-request", postLeaveRequest);
router.get("/get-leave-requests", getLeaveRequests)

module.exports = router