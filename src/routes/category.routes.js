// src/routes/user.routes.js
const express = require("express");
const { addCategory, getCategory, deleteCategory, updateCategory } = require("../controllers/category/category.controller");

const router = express.Router();

router.post("/post-category", addCategory); // post a category
router.get("/get-category", getCategory); // get all category
router.delete("/delete-category/:id", deleteCategory); // delete a category
router.patch("/edit-category/:id", updateCategory); // edit a category

module.exports = router;
