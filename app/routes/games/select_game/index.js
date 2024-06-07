const express = require("express");
const router = express.Router();
const protect = require("../../../middleware/protect");
const { selectGame } = require("../../../controllers/games/select_game");

// ^ add module
router.route("/select-game").post(protect, selectGame);

module.exports = router;
