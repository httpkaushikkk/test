const express = require("express");
const router = express.Router();
const protect = require("../../middleware/protect");
const {
  uploadGameFile,
  uploadGameIcon,
  paymentOrder,
  profileUpload,
} = require("../../controllers/common");
const multer = require("../../middleware/multer");

// ^ upload file
router.route("/upload-game").post(multer.array("files"), uploadGameFile);

// ^ upload profile
router.route("/upload-profile").post(multer.single("file"), profileUpload);

// ^ upload game icons
router
  .route("/upload-game-icon")
  .post(protect, multer.single("file"), uploadGameIcon);

router.route("/payment/order").post(protect, paymentOrder);

module.exports = router;
