const express = require('express');
const { addTask, getTasks, getTask } = require('../controllers/tasks/task.controller');
const { uploadFileToSamba } = require('../controllers/tasks/uploadFileToSamba.controller');
const { fileUpload } = require('../middlewares/fileUpload');
const { employeeAcceptTask, employeeSubmitTask } = require('../controllers/tasks/employeeTask.controller');
const { ceoAcceptTask } = require('../controllers/tasks/ceoTaskController');

const router = express.Router();

router.post('/post-task', addTask); // add new task
router.get("/get-tasks", getTasks) // get all task
router.get("/get-task/:id", getTask) // get an task

// employee related
router.put('/employee-accept-task/:id', employeeAcceptTask)
router.put('/employee-submit-task/:id', employeeSubmitTask)
router.post('/upload', fileUpload?.single('file'), uploadFileToSamba);

// ceo related
router.put("/ceo-accept-task/:id", ceoAcceptTask)




module.exports = router;
