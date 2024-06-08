const express = require("express");
const router = express.Router();
const protect = require("../../../middleware/protect");
const { fetchReport, fetchAllReport } = require("../../../controllers/report/game_report");

// ^ fetch module
router.route("/fetch").post(protect, fetchReport);

// ^ fetch all module
router.route("/fetch-all").post(protect, fetchAllReport);

module.exports = router;
