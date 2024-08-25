const express = require('express');
const {
  postAdvancePayment,
  getAdvancePayment,
} = require('../controllers/advancePayment/advancePayment.controller');
const router = express.Router();

// attendence related routes
router.post('/advance-payment', postAdvancePayment); //post advance payment routes
router.get('/get-advance-payment', getAdvancePayment); //get advance payment routes

module.exports = router;
