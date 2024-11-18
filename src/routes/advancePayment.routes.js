const express = require('express');
const {
  postAdvancePayment,
  getAdvancePayment,
  deleteAdvance,
  editAdvancePayment,
} = require('../controllers/advancePayment/advancePayment.controller');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

// attendence related routes
router.post('/advance-payment', verifyToken, postAdvancePayment); //post advance payment routes
router.get('/get-advance-payment', verifyToken, getAdvancePayment); //get advance payment routes
router.delete('/delete-advance/:id', verifyToken, deleteAdvance); //get advance payment routes
router.patch('/edit-advance-payment/:id', verifyToken, editAdvancePayment); //get advance payment routes

module.exports = router;
