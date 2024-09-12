
const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const { addDisclaimer, deleteDisclaimer, updateDisclaimer } = require('../controllers/disclaimer/disclaimer.controller');
const { getDesignation } = require('../controllers/designation/designation.controller');

const router = express.Router();

router.post('/post-disclaimer', verifyToken, addDisclaimer); // post all disclaimer
router.get('/get-disclaimer', verifyToken, getDesignation); // get all disclaimer
router.delete('/delete-disclaimer/:id', verifyToken, deleteDisclaimer); // delete a disclaimer
router.patch('/edit-disclaimer/:id', verifyToken, updateDisclaimer); // edit a disclaimer

module.exports = router;
