const express = require('express');
const {
  postPaymentHistory,
  getPaymentHistory,
} = require('../controllers/paymentHistory/paymentHistory.controller');
const {
  getAllPaymentHistory,
} = require('../controllers/paymentHistory/allPaymentHistory.controller');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

// payment routes
router.post('/post-payment-history', verifyToken, postPaymentHistory);
router.get('/get-payment-history', verifyToken, getPaymentHistory);
router.get('/get-all-payment-history', verifyToken, getAllPaymentHistory);

module.exports = router;
