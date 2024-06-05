const checkStatus = require("../../middleware/check_status");
const Admin = require("../../modals/authenticator/admin");
const asyncHandler = require("express-async-handler");
const { moduleSchema } = require("./validate");
const Module = require("../../modals/module");
const bcrypt = require("bcrypt");

// ^ add module
exports.add = asyncHandler(async (req, res, next) => {
  // joi validation
  const { error } = moduleSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ status: 0, error: error.details[0].message });
  }

  const { admin_id, module_name, module_path, permissions } = req.body;

  const admin = await Admin.findOne({ _id: admin_id });
  if (!admin)
    return res.status(401).json({ status: 0, error: "User not found" });

  // check user active status
  checkStatus(res, admin.status);

  const managementData = { creater: admin.name, updater: admin.name };

  try {
    const module = await Module.create({
      module_name,
      module_path,
      permissions,
      management: managementData,
    });
    res
      .status(200)
      .json({ status: 1, module, message: "Module create success" });
  } catch (err) {
    res.status(500).json({ status: 0, error: err.message });
  }
});

// ^ fetch module
exports.fetchModule = asyncHandler(async (req, res, next) => {
  const { _id, admin_id } = req.body;

  const admin = await Admin.findOne({ _id: admin_id });
  if (!admin)
    return res.status(401).json({ status: 0, error: "User not found" });

  // check user active status
  checkStatus(res, admin.status);

  const module = await Module.findOne({ _id });
  if (!module)
    return res.status(401).json({ status: 0, error: "Module not found" });

  await Module.findOne({ _id })
    .then((response) => {
      res.status(200).json({
        status: 1,
        response,
      });
    })
    .catch((err) => {
      res.status(404).json({
        status: 0,
        error: "Module not found",
      });
    });
});

// ^ fetch all module
exports.fetchAllModule = asyncHandler(async (req, res, next) => {
  const { admin_id } = req.body;

  const admin = await Admin.findOne({ _id: admin_id });
  if (!admin)
    return res.status(401).json({ status: 0, error: "User not found" });

  // check user active status
  checkStatus(res, admin.status);

  await Module.find()
    .then((response) => {
      res.status(200).json({
        status: 1,
        response,
      });
    })
    .catch((err) => {
      res.status(404).json({ status: 0, error: "Module not found" });
    });
});

// ^ edit module
exports.edit = asyncHandler(async (req, res, next) => {
  const { _id, admin_id, module_name, module_path, is_active, permissions } =
    req.body;

  const admin = await Admin.findOne({ _id: admin_id });
  if (!admin)
    return res.status(401).json({ status: 0, error: "User not found" });

  // check user active status
  checkStatus(res, admin.status);

  const module = await Module.findOne({ _id });
  if (!module)
    return res.status(401).json({ status: 0, error: "Module not found" });

  const managementData = {
    creater: module.management.creater,
    updater: admin.name,
  };

  let permissionData = [];
  for (let i = 0; i < module.permissions.length; i++) {
    for (let k = 0; k < permissions.length; k++) {
      if (module.permissions[i]._id == permissions[k]._id) {
        let obj = {
          _id: module.permissions[i]._id,
          action_name: permissions[k].action_name
            ? permissions[k].action_name
            : module.permissions[i].action_name,
          name: permissions[k].name
            ? permissions[k].name
            : module.permissions[i].name,
        };
        permissionData.push(obj);
      }
    }
  }

  try {
    const updateObj = {
      $set: {
        module_name: module_name,
        module_path: module_path,
        is_active: is_active,
        management: managementData,
      },
    };
    permissionData.forEach((item, index) => {
      updateObj.$set[`permissions[${index}].name`] = item.name;
      updateObj.$set[`permissions[${index}].action_name`] = item.action_name;
    });
    let data = await Module.findOneAndUpdate({ _id: _id }, updateObj, {
      new: true,
      arrayFilters: permissionData.map((permission, index) => ({
        [`${index}._id`]: permission._id,
      })),
    });

    res.status(200).json({ message: "update success." });
  } catch (err) {
    res.status(400).json({ status: 0, message: err });
  }
});

// ^ delete module
exports.deleteModule = asyncHandler(async (req, res, next) => {
  const { _id, admin_id, password } = req.body;

  const admin = await Admin.findOne({ _id: admin_id });
  if (!admin)
    return res.status(401).json({ status: 0, error: "User not found" });

  // check user active status
  checkStatus(res, admin.status);

  const module = await Module.findOne({ _id });
  if (!module)
    return res.status(401).json({ status: 0, error: "Module not found" });

  module
    .deleteOne()
    .then((response) => {
      res.status(200).json({ status: 1, message: "Module delete success" });
    })
    .catch((err) => {
      res.status(400).json({ status: 0, message: "Module not deleted!" });
    });
});
