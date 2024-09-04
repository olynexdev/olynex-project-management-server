// src/routes/user.routes.js
const express = require('express');
const {
  addUser,
  deleteUser,
  getUserById,
  updateUser,
  usersCount,
} = require('../controllers/users/users.controller');
const {
  getUsers,
  getUserwithEmail,
  getUserWithRole,
  getUserbyUserId,
} = require('../controllers/users/getUser.controller');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.post('/create-user', verifyToken, addUser); // create new user
router.get('/get-users', verifyToken, getUsers); // get all User
router.delete('/delete-user/:id', verifyToken, deleteUser); // delete a User
router.patch('/update-user/:id', verifyToken, updateUser);

// get user
router.get('/get-user', verifyToken, getUserwithEmail);
router.get('/get-user-role/:email', verifyToken, getUserWithRole);
router.get('/get-user/:id', verifyToken, getUserById);
router.get('/get-user-by-user-id/:userId', verifyToken, getUserbyUserId);
router.get('/get-users-count/:month', verifyToken, usersCount);

module.exports = router;
