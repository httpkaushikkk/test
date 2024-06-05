const express = require("express");
const router = express.Router();
const {
  fetch,
  add,
  fetchAll,
  edit,
  deleteTransaction,
} = require("../../../controllers/account/transactions");

// ^ add transactions
router.route("/add").post(protect, add);

// ^ fetch single transactions
router.route("/fetch").post(protect, fetch);

// ^ fetch all transactions
router.route("/fetch-all").post(protect, fetchAll);

// ^ edit transactions
router.route("/edit").post(protect, edit);

// ^ delete transactions
router.route("/delete").post(protect, deleteTransaction);

module.exports = router;
