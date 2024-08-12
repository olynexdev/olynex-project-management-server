const express = require('express');
const { addTask } = require('../controllers/tasks/task.controller');

const router = express.Router();

router.post('/post-task', addTask); // add new task

module.exports = router;
