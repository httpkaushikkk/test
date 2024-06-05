const express = require("express");
const router = express.Router();
const protect = require("../../../middleware/protect");
const {
  addWallet,
  fetchWallet,
  fetchAllWallet,
  editWallet,
  deleteWallet,
} = require("../../../controllers/account/wallet");

// ^ add wallet
router.route("/add").post(protect, addWallet);

// ^ fetch single wallet
router.route("/fetch").post(protect, fetchWallet);

// ^ fetch all wallet
router.route("/fetch-all").post(protect, fetchAllWallet);

// ^ edit wallet
router.route("/edit").post(protect, editWallet);

// ^ delete wallet
router.route("/delete").post(protect, deleteWallet);

module.exports = router;
