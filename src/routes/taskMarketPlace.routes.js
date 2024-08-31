const express = require("express");
const {
  addTaskMarketPlace,
  getTaskMarketPlace,
  UpdateTaskMarketPlace,
} = require("../controllers/taskMarketPlace/TaskMarketPlace.controller");
const router = express.Router();

router.post("/post-task-marketplace", addTaskMarketPlace);
router.get("/get-task-marketplace", getTaskMarketPlace)
router.put("/update-task-marketplace/:id", UpdateTaskMarketPlace)

module.exports = router;
