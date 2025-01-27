const express = require('express');
const {
  addTask,
  getTasks,
  getTask,
  getRunningTask,
  searchTask,
  deleteTask,
  getAllSubmittedTasks,
} = require('../controllers/tasks/task.controller');
const {
  employeeAcceptTask,
  employeeSubmitTask,
  getTasksImages,
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
const {
  deliveryTeamUploadTask,
} = require('../controllers/tasks/deliveryTeamTask.controller');
const { taskCount } = require('../controllers/tasks/taskCount.controller');
const verifyToken = require('../middlewares/verifyToken');
const verifyTaskAccess = require('../middlewares/verifyTaskAccess');
const {
  postImage,
  upload,
} = require('../controllers/tasks/taskImageUploadController');

const router = express.Router();

router.post('/post-task', verifyToken, addTask); // add new task
router.delete('/delete-task/:id', verifyToken, deleteTask); // delete task
router.get('/get-tasks', verifyToken, getTasks); // get all task
router.get('/get-all-submitted-tasks', verifyToken, getAllSubmittedTasks); // get all task
router.get('/get-task/:id', verifyToken, verifyTaskAccess, getTask); // get an task
router.get('/get-running-task/:userId', verifyToken, getRunningTask); // get running task

// employee related
router.put(
  '/employee-accept-task/:id',
  verifyToken,
  verifyTaskAccess,
  employeeAcceptTask
);
router.put(
  '/employee-submit-task/:id',
  verifyToken,
  verifyTaskAccess,
  employeeSubmitTask
);

// ceo related
router.put(
  '/ceo-accept-task/:id',
  verifyToken,
  verifyTaskAccess,
  ceoAcceptTask
);
router.put(
  '/ceo-reject-task/:id',
  verifyToken,
  verifyTaskAccess,
  ceoRejectTask
);
router.put(
  '/ceo-reject-mockup/:id',
  verifyToken,
  verifyTaskAccess,
  ceoRejectMockup
);

// project manager related
router.put(
  '/project-manager-accept-task/:id',
  verifyToken,
  verifyTaskAccess,
  projectManagerAcceptTask
);
router.put(
  '/project-manager-rejected-task/:id',
  verifyToken,
  verifyTaskAccess,
  projectManagerRejected
);

// mockup related
router.put(
  '/mockup-confirm-task/:id',
  verifyToken,
  verifyTaskAccess,
  mockupConfirmTask
);

// seo related
router.put(
  '/seo-accept-task/:id',
  verifyToken,
  verifyTaskAccess,
  seoAcceptTask
);

// delivery team related
router.put(
  '/delivery-member-uploaded-task/:id',
  verifyToken,
  verifyTaskAccess,
  deliveryTeamUploadTask
);
router.get('/get-tasks-counts/:month', verifyToken, taskCount);
router.get('/search-tasks', verifyToken, searchTask);
router.post('/upload-images', upload.array('images'), postImage);
router.get('/get-images', getTasksImages);

module.exports = router;
