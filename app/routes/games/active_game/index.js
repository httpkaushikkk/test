const express = require("express");
const router = express.Router();
const protect = require("../../../middleware/protect");
const {
  fetchActiveGames,
  fetchAllActiveGames,
} = require("../../../controllers/games/active_game");

// ^ add module
router.route("/active/fetch").post(protect, fetchActiveGames);

// ^ add module
router.route("/fetch-all").post(protect, fetchAllActiveGames);

module.exports = router;
