const express = require('express');
const {
  postPaymentHistory,
  getPaymentHistory,
} = require('../controllers/paymentHistory/paymentHistory.controller');
const {
  getAllPaymentHistory,
} = require('../controllers/paymentHistory/allPaymentHistory.controller');
const router = express.Router();

// payment routes
router.post('/post-payment-history', postPaymentHistory);
router.get('/get-payment-history', getPaymentHistory);
router.get('/get-all-payment-history', getAllPaymentHistory);

module.exports = router;
