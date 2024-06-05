const express = require("express");
const router = express.Router();
const protect = require("../../middleware/protect");
const {  } = require("../../../controllers/module/permission")

// ^ add permission
router.route("/add").post(protect, add);

// ^ add permission
router.route("/fetch").post(protect, fetchPermission);

// ^ add permission
router.route("/fetch-all").post(protect, fetchAllPermission);

// ^ edit permission
router.route("/edit").post(protect, edit);

// ^ delete permission
router.route("/delete").post(protect, deletePermission);

module.exports = router;
