// src/routes/user.routes.js
const express = require("express");
const { addDesignation, getDesignation, deleteDesignation, updateDesignation } = require("../controllers/designation/designation.controller");

const router = express.Router();

router.post("/post-designation", addDesignation); // post all designation
router.get("/get-designation", getDesignation); // get all designation
router.delete("/delete-designation/:id", deleteDesignation); // delete a designation
router.patch("/edit-designation/:id", updateDesignation); // edit a designation

module.exports = router;
