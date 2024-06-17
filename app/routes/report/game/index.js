const express = require("express");
const router = express.Router();
const protect = require("../../../middleware/protect");
const { createGameReport } = require("../../../controllers/report/game");

// ^ fetch module
router.route("/fetch").post(protect, createGameReport);

module.exports = router;
