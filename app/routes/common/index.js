const express = require("express");
const router = express.Router();
const protect = require("../../middleware/protect");
const { uploadGameFile, uploadGameIcon } = require("../../controllers/common");
const multer = require("../../middleware/multer");

// ^ upload file
router
  .route("/upload-game")
  .post(multer.array("files"), uploadGameFile);

// ^ upload game icons
router
  .route("/upload-game-icon")
  .post(protect, multer.single("file"), uploadGameIcon);

module.exports = router;
