const express = require('express');
const {
  addTaskMarketPlace,
  getTaskMarketPlace,
  UpdateTaskMarketPlace,
} = require('../controllers/taskMarketPlace/TaskMarketPlace.controller');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

router.post('/post-task-marketplace', verifyToken, addTaskMarketPlace);
router.get('/get-task-marketplace', verifyToken, getTaskMarketPlace);
router.put('/update-task-marketplace/:id', verifyToken, UpdateTaskMarketPlace);

module.exports = router;
