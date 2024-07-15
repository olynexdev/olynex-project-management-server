// src/routes/user.routes.js
const express = require('express');
const { addDepartment } = require('../controllers/department.controller');
const router = express.Router();

router.post('/post-department', addDepartment);

module.exports = router;
