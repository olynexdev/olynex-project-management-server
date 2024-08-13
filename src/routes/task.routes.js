const express = require('express');
const { addTask, getTasks } = require('../controllers/tasks/task.controller');
const { employeeAcceptTask } = require('../controllers/tasks/employeeUpdateTask.controller');

const router = express.Router();

router.post('/post-task', addTask); // add new task
router.get("/get-tasks", getTasks) // get all task

// employee related
router.put('/employee-accept-task/:id', employeeAcceptTask)

module.exports = router;
