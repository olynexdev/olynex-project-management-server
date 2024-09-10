const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const {
  addColorSpace,
  getColorSpace,
  deleteColorSpace,
  updateColorSpace,
} = require('../controllers/colorSpace/colorSpace.controller');

const router = express.Router();

router.post('/post-color-space', verifyToken, addColorSpace); // post a color-space
router.get('/get-color-space', verifyToken, getColorSpace); // get all color-space
router.delete('/delete-color-space/:id', verifyToken, deleteColorSpace); // delete a color-space
router.patch('/edit-color-space/:id', verifyToken, updateColorSpace); // edit a color-space

module.exports = router;
