const express = require('express');
const {
  addFileType,
  getFileType,
  deleteFileType,
  updateFileType,
} = require('../controllers/fileType/fileType.controller');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.post('/post-file-type', verifyToken, addFileType); // add new file type
router.get('/get-file-type', verifyToken, getFileType); //  get all file type
router.delete('/delete-file-type/:id', verifyToken, deleteFileType); // delete an file type
router.patch('/edit-file-type/:id', verifyToken, updateFileType); // edit an file type

module.exports = router;
