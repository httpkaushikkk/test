const express = require("express");
const router = express.Router();
const protect = require("../../../middleware/protect");
const {
  fetchActiveGames,
  fetchAllActiveGames,
  editActiveGames,
} = require("../../../controllers/games/active_game");

// ^ add module
router.route("/fetch").post(protect, fetchActiveGames);

// ^ add module
router.route("/fetch-all").post(protect, fetchAllActiveGames);

// ^ edit module
router.route("/edit").post(protect, editActiveGames);

module.exports = router;
