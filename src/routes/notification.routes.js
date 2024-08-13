const express = require('express');
const {
  addNotification,
} = require('../controllers/notification/notification.controller');

const router = express.Router();

router.post('/post-notification', addNotification); // post notification api

module.exports = router;
