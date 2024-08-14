const express = require('express');
const {
  addNotification,
  getNotification,
  updateReadNotification,
} = require('../controllers/notification/notification.controller');

const router = express.Router();

router.post('/post-notification', addNotification); // post notification api
router.get('/get-notification/:id', getNotification); // post notification api
router.patch('/read-notification/:id', updateReadNotification);

module.exports = router;
