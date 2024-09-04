const express = require('express');
const { PostJwt, RemoveJwt } = require('../controllers/jwt/jwt.controller');

const router = express.Router();

router.post('/jwt', PostJwt);
router.post('/logout', RemoveJwt);

module.exports = router;
