const express = require('express');
const {
  addTask,
  getTasks,
  getTask,
  getRunningTask,
} = require('../controllers/tasks/task.controller');
const {
  employeeAcceptTask,
  employeeSubmitTask,
} = require('../controllers/tasks/employeeTask.controller');
const {
  ceoAcceptTask,
  ceoRejectTask,
  ceoRejectMockup,
} = require('../controllers/tasks/ceoTask.controller');
const {
  projectManagerAcceptTask,
  projectManagerRejected,
} = require('../controllers/tasks/projectManagerTask.controller');
const {
  mockupConfirmTask,
} = require('../controllers/tasks/mockupTask.controller');
const { seoAcceptTask } = require('../controllers/tasks/SeoTask.controller');
const { deliveryTeamUploadTask } = require('../controllers/tasks/deliveryTeamTask.controller');

const router = express.Router();

router.post('/post-task', addTask); // add new task
router.get('/get-tasks', getTasks); // get all task
router.get('/get-task/:id', getTask); // get an task
router.get('/get-running-task/:userId', getRunningTask); // get running task

// employee related
router.put('/employee-accept-task/:id', employeeAcceptTask);
router.put('/employee-submit-task/:id', employeeSubmitTask);

// ceo related
router.put('/ceo-accept-task/:id', ceoAcceptTask);
router.put('/ceo-reject-task/:id', ceoRejectTask);
router.put('/ceo-reject-mockup/:id', ceoRejectMockup);

// project manager related
router.put('/project-manager-accept-task/:id', projectManagerAcceptTask);
router.put('/project-manager-rejected-task/:id', projectManagerRejected);

// mockup related
router.put('/mockup-confirm-task/:id', mockupConfirmTask);

// seo related
router.put('/seo-accept-task/:id', seoAcceptTask);

// delivery team related
router.put("/delivery-member-uploaded-task/:id", deliveryTeamUploadTask)

module.exports = router;
