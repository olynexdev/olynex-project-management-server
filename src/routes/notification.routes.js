const express = require('express');
const {
  addNotification,
  getNotification,
  updateReadNotification,
  deleteNotification,
  getPagination,
} = require('../controllers/notification/notification.controller');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.post('/post-notification', verifyToken, addNotification); // post notification api
router.get('/get-notification/:id', verifyToken, getNotification); // post notification api
router.patch('/read-notification/:id', verifyToken, updateReadNotification); //patch isRead in notification
router.delete('/delete-notification/:id', verifyToken, deleteNotification);

module.exports = router;
