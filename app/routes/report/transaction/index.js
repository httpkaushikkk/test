const express = require("express");
const router = express.Router();
const protect = require("../../../middleware/protect");
const {
  createTransactionReport,
} = require("../../../controllers/report/transaction");

// ^ fetch report
router.route("/fetch").post(protect, createTransactionReport);

module.exports = router;