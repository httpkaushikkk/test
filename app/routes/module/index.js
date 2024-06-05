const express = require("express");
const router = express.Router();
const protect = require("../../middleware/protect");
const { add, edit, deleteModule, fetchAllModule, fetchModule } = require("../../controllers/module");

// ^ add module
router.route("/add").post(protect, add);

// ^ add module
router.route("/fetch").post(protect, fetchModule);

// ^ add module
router.route("/fetch-all").post(protect, fetchAllModule);

// ^ edit module
router.route("/edit").post(protect, edit);

// ^ delete module
router.route("/delete").post(protect, deleteModule);

module.exports = router;
