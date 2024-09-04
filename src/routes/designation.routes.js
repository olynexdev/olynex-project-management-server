// src/routes/user.routes.js
const express = require('express');
const {
  addDesignation,
  getDesignation,
  deleteDesignation,
  updateDesignation,
} = require('../controllers/designation/designation.controller');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.post('/post-designation', verifyToken, addDesignation); // post all designation
router.get('/get-designation', verifyToken, getDesignation); // get all designation
router.delete('/delete-designation/:id', verifyToken, deleteDesignation); // delete a designation
router.patch('/edit-designation/:id', verifyToken, updateDesignation); // edit a designation

module.exports = router;
