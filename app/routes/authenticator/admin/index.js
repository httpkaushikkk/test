const express = require("express");
const router = express.Router();
const protect = require("../../../middleware/protect");
const {
  addAdmin,
  loginAdmin,
  fetchAdmin,
  fetchAllAdmin,
  editAdmin,
  deleteAdmin,
  sendMail,
  resetPassword
} = require("../../../controllers/authenticator/admin");

// ^ add admin
router.route("/add").post(addAdmin);

// ^ login admin
router.route("/login").post(loginAdmin);

// ^ fetch single admin profile
router.route("/fetch").post(protect, fetchAdmin);

// ^ fetch all admin profile
router.route("/fetch-all").post(protect, fetchAllAdmin);

// ^ edit admin
router.route("/edit").post(protect, editAdmin);

// ^ delete admin
router.route("/delete").post(protect, deleteAdmin);

// // ^ send mail
// router.route("/send-mail").post(sendMail);

// // ^ reset password admin
// router.route("/reset-password").post(resetPassword);

module.exports = router;
