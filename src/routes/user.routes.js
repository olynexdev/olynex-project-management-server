// src/routes/user.routes.js
const express = require("express");
const {
  addUser,
  deleteUser,
  getUserById,
  updateUser,
} = require("../controllers/users/users.controller");
const {
  getUsers,
  getUserwithEmail,
  getUserWithRole,
} = require("../controllers/users/getUser.controller");

const router = express.Router();

router.post("/create-user", addUser); // create new user
router.get("/get-users", getUsers); // get all User
router.delete("/delete-user/:id", deleteUser); // delete a User
router.patch("/update-user/:id", updateUser);

// get user
router.get("/get-user", getUserwithEmail);
router.get("/get-user-role/:email", getUserWithRole);
router.get("/get-user/:id", getUserById);

module.exports = router;
