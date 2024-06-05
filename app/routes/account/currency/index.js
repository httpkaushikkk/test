const express = require("express");
const router = express.Router();
const protect = require("../../../middleware/protect");
const {
  addCurrency,
  fetchCurrency,
  fetchAllCurrency,
  editCurrency,
  deleteCurrency,
} = require("../../../controllers/account/currency");

// ^ add currency
router.route("/add").post(protect, addCurrency);

// ^ fetch single currency
router.route("/fetch").post(protect, fetchCurrency);

// ^ fetch all currency
router.route("/fetch-all").post(protect, fetchAllCurrency);

// ^ edit currency
router.route("/edit").post(protect, editCurrency);

// ^ delete currency
router.route("/delete").post(protect, deleteCurrency);

module.exports = router;
