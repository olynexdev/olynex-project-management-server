// src/routes/user.routes.js
const express = require('express');
const {
  addCategory,
  getCategory,
  deleteCategory,
  updateCategory,
} = require('../controllers/category/category.controller');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.post('/post-category', verifyToken, addCategory); // post a category
router.get('/get-category', verifyToken, getCategory); // get all category
router.delete('/delete-category/:id', verifyToken, deleteCategory); // delete a category
router.patch('/edit-category/:id', verifyToken, updateCategory); // edit a category

module.exports = router;
