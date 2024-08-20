// src/routes/user.routes.js
const express = require("express");
const {
  addUser,
  deleteUser,
  getUserById,
} = require("../controllers/users/users.controller");
const {
  getUsers,
  getUserwithEmail,
  getUserWithRole,
  getUserbyUserId,
} = require("../controllers/users/getUser.controller");

const router = express.Router();

router.post("/create-user", addUser); // create new user
router.get("/get-users", getUsers); // get all User
router.delete("/delete-user/:id", deleteUser); // delete a User

// get user
router.get("/get-user", getUserwithEmail);
router.get("/get-user-role/:email", getUserWithRole);
router.get("/get-user/:id", getUserById);
router.get('/get-user-by-user-id/:userId', getUserbyUserId)

module.exports = router;
