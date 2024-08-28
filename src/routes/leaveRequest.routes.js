const express = require("express");
const { postLeaveRequest, getLeaveRequests, responseLeaveRequest, getLeaveRequest} = require("../controllers/leaveRequest/leaveRequest.controller");
const router = express.Router();

// leave requst CRUD
router.post("/post-leave-request", postLeaveRequest);
router.get("/get-leave-requests", getLeaveRequests)
router.get("/get-leave-request/:id", getLeaveRequest)
router.put("/leave-request-respons/:id", responseLeaveRequest)

module.exports = router