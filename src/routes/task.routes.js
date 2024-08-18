const express = require('express');
const {
  addTask,
  getTasks,
  getTask,
} = require('../controllers/tasks/task.controller');
const {
  uploadFileToSamba,
} = require('../controllers/tasks/uploadFileToSamba.controller');
const { fileUpload } = require('../middlewares/fileUpload');
const {
  employeeAcceptTask,
  employeeSubmitTask,
} = require('../controllers/tasks/employeeTask.controller');
const {
  ceoAcceptTask,
  ceoRejectTask,
} = require('../controllers/tasks/ceoTaskController');
const {
  projectManagerAcceptTask,
  projectManagerRejected,
} = require('../controllers/tasks/projectManagerTaskController');
const {
  mockupConfirmTask,
} = require('../controllers/tasks/mockupTaskController');

const router = express.Router();

router.post('/post-task', addTask); // add new task
router.get('/get-tasks', getTasks); // get all task
router.get('/get-task/:id', getTask); // get an task

// employee related
router.put('/employee-accept-task/:id', employeeAcceptTask);
router.put('/employee-submit-task/:id', employeeSubmitTask);
router.post('/upload', fileUpload?.single('file'), uploadFileToSamba);

// ceo related
router.put('/ceo-accept-task/:id', ceoAcceptTask);
router.put('/ceo-reject-task/:id', ceoRejectTask);

// project manager related
router.put('/project-manager-accept-task/:id', projectManagerAcceptTask);
router.put('/project-manager-rejected-task/:id', projectManagerRejected);
router.put('/mockup-confirm-task/:id', mockupConfirmTask);

module.exports = router;
