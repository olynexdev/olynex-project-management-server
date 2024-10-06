// src/routes/user.routes.js
const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const {
  addCosting,
  getCosting,
} = require('../controllers/costing/costing.controller');

const router = express.Router();

router.post('/post-costing', verifyToken, addCosting);
router.get('/get-costing', verifyToken, getCosting);

module.exports = router;
