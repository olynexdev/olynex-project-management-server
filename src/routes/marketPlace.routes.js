const express = require('express');
const {
  addMarketPlace,
  getAllMarketPlace,
  deleteMarketPlace,
  updateMarketPlace,
} = require('../controllers/marketPlace/marketPlace.controllers');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.post('/post-marketPlace', verifyToken, addMarketPlace);
router.get('/get-marketPlace', verifyToken, getAllMarketPlace);
router.delete('/delete-marketPlace/:id', verifyToken, deleteMarketPlace);
router.patch('/edit-marketPlace/:id', verifyToken, updateMarketPlace);

module.exports = router;
