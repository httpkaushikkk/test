const express = require("express");
const router = express.Router();
const protect = require("../../../middleware/protect");
const {
  fetch,
  add,
  fetchAll,
  edit,
  deleteTransaction,
  downloadExcel,
} = require("../../../controllers/account/transactions");

// ^ add transactions
router.route("/add").post(protect, add);

// ^ fetch single transactions
router.route("/fetch").post(protect, fetch);

// ^ fetch all transactions
router.route("/fetch-all").post(protect, fetchAll);

// ^ export excel transactions
router.route("/excel").post(protect, downloadExcel);

// ^ edit transactions
router.route("/edit").post(protect, edit);

// ^ delete transactions
router.route("/delete").post(protect, deleteTransaction);

module.exports = router;
