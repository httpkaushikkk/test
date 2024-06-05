const express = require("express");
const router = express.Router();
const protect = require("../../middleware/protect");
const {
  addGames,
  editGames,
  fetchGames,
  fetchAllGames,
  gameDelete,
} = require("../../controllers/games/index");
const multer = require("../../middleware/multer");

// ^ add module
router.route("/add").post(
  protect,
  multer.fields([
    { name: "file2", maxCount: 10 },
    { name: "file1", maxCount: 1 },
  ]),
  addGames
);

// ^ add module
router.route("/fetch").post(protect, fetchGames);

// ^ add module
router.route("/fetch-all").post(protect, fetchAllGames);

// ^ edit module
router.route("/edit").post(protect, editGames);

// ^ delete module
router.route("/delete").post(protect, gameDelete);

module.exports = router;
