const express = require("express");
const { postPaymentHistory, getPaymentHistory } = require("../controllers/paymentHistory/paymentHistory.controller");
const router = express.Router();

// payment routes
router.post("/post-payment-history", postPaymentHistory)
router.get("/get-payment-history", getPaymentHistory)

module.exports = router;