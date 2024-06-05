const express = require("express");
const router = express.Router();
const protect = require("../../../middleware/protect");
const {
  checkUsername,
  register,
  login,
  fetchUser,
  fetchAllUser,
  editUser,
  deleteUser,
} = require("../../../controllers/authenticator/user");

// ^ check username for available
router.route("/check-username").post(checkUsername);

// ^ register user routes
router.route("/register").post(register);

// ^ login user routes
router.route("/login").post(login);

// ^ fetch single user profile
router.route("/fetch").post(protect, fetchUser);

// ^ fetch all user profile
router.route("/fetch-all").post(protect, fetchAllUser);

// ^ edit user
router.route("/edit").post(protect, editUser);

// ^ delete user
router.route("/delete").post(protect, deleteUser);

module.exports = router;
