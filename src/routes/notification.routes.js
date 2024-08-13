const express = require('express');
const {
  addNotification,
  getNotification,
} = require('../controllers/notification/notification.controller');

const router = express.Router();

router.post('/post-notification', addNotification); // post notification api
router.get('/get-notification/:id', getNotification); // post notification api

module.exports = router;
