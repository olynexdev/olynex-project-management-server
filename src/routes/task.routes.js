const express = require('express');
const { addTask, getTasks } = require('../controllers/tasks/task.controller');

const router = express.Router();

router.post('/post-task', addTask); // add new task
router.get("/get-tasks", getTasks) // get all task

module.exports = router;
