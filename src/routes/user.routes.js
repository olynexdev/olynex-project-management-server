// src/routes/user.routes.js
const express = require("express");
const { getUsers, addUser, deleteUser } = require("../controllers/users/users.controller");

const router = express.Router();

router.post("/create-user", addUser); // create new user
router.get("/get-users", getUsers); // get all User
router.delete("/delete-user/:id", deleteUser); // delete a User

module.exports = router;
