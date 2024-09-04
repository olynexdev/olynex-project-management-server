// src/routes/user.routes.js
const express = require('express');
const {
  addDepartment,
  getDepartment,
  deleteDepartment,
  updateDepartment,
} = require('../controllers/department/department.controller');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.post('/post-department', verifyToken, addDepartment); // post all department
router.get('/get-department', verifyToken, getDepartment); // get all department
router.delete('/delete-department/:id', verifyToken, deleteDepartment); // delete a department
router.patch('/edit-department/:id', verifyToken, updateDepartment); // edit a department

module.exports = router;
