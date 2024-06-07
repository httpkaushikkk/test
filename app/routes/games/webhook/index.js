const express = require("express");
const router = express.Router();
const { generateLink, webhook } = require("../../../controllers/games/webhook");
const protect = require("../../../middleware/protect");

// ^ add module
router.route("/generate-link").post(protect, generateLink);

// ^ webhook
router.route("/uploads/games/:folder/:file/:id").post(webhook);

module.exports = router;