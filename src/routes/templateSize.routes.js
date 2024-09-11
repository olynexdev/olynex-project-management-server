const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const {
  addTemplateSize,
  getTemplateSize,
  deleteTemplateSize,
  updateTemplateSize,
} = require('../controllers/templateSize/templateSize.controller');

const router = express.Router();

router.post('/post-template-size', verifyToken, addTemplateSize); // post a template-size
router.get('/get-template-size', verifyToken, getTemplateSize); // get all template-size
router.delete('/delete-template-size/:id', verifyToken, deleteTemplateSize); // delete a template-size
router.patch('/edit-template-size/:id', verifyToken, updateTemplateSize); // edit a template-size

module.exports = router;
