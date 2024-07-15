// src/routes/user.routes.js
const express = require("express");
const {
  addDepartment,
  getDepartment,
  deleteDepartment,
  updateDepartment,
} = require("../controllers/department/department.controller");

const router = express.Router();

router.post("/post-department", addDepartment); // post all department
router.get("/get-department", getDepartment); // get all department
router.delete("/delete-department/:id", deleteDepartment); // delete a department
router.patch("/edit-department/:id", updateDepartment); // edit a department

module.exports = router;
