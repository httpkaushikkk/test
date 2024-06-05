const checkStatus = require("../../../middleware/check_status");
const Currency = require("../../../modals/account/currency");
const Admin = require("../../../modals/authenticator/admin");
const asyncHandler = require("express-async-handler");
const { currencySchema } = require("./validate");
const bcrypt = require("bcrypt");

// ^ add currency
exports.addCurrency = asyncHandler(async (req, res, next) => {
  // joi validation
  const { error } = currencySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { admin_id, name, short_name } = req.body;

  const admin = await Admin.findOne({ _id: admin_id });
  checkStatus(res, admin.status);

  try {
    const currency = await Currency.create({ name, short_name });
    res.status(200).json({
      status: 1,
      currency,
      message: "Currency add suceess.",
    });
  } catch (err) {
    res.status(500).json({ status: 0, error: err.message });
  }
});

// ^ edit currency
exports.editCurrency = asyncHandler(async (req, res, next) => {
  const { admin_id, _id, name, short_name } = req.body;

  const admin = await Admin.findOne({ _id: admin_id });
  checkStatus(res, admin.status);

  await Currency.findOneAndUpdate(
    {
      _id,
    },
    {
      $set: { name, short_name },
    }
  )
    .then((response) => {
      res.status(200).json({
        message: "update success.",
      });
    })
    .catch((err) => {
      res.status(400).json({ status: 0, message: err });
    });
});

// ^ fetch currency
exports.fetchCurrency = asyncHandler(async (req, res, next) => {
  const { admin_id, _id } = req.body;

  const admin = await Admin.findOne({ _id: admin_id });
  checkStatus(res, admin.status);

  await Currency.findOne({ _id })
    .then((response) => {
      res.status(200).json({
        status: 1,
        response,
      });
    })
    .catch((err) => {
      res.status(404).json({ status: 0, error: "Currency not found" });
    });
});

// ^ fetch all currency
exports.fetchAllCurrency = asyncHandler(async (req, res, next) => {
  const { admin_id } = req.body;

  const admin = await Admin.findOne({ _id: admin_id });
  checkStatus(res, admin.status);

  await Currency.find()
    .then((response) => {
      res.status(200).json({
        status: 1,
        response,
      });
    })
    .catch((err) => {
      res.status(404).json({ status: 0, error: "Currency not found" });
    });
});

// ^ delete currency
exports.deleteCurrency = asyncHandler(async (req, res, next) => {
  const { _id, admin_id, password } = req.body;

  const admin = await Admin.findOne({ _id: admin_id });
  checkStatus(res, admin.status);

  const currency = await Currency.findOne({ _id });
  if (!currency)
    return res.status(400).json({ status: 0, message: "currency not found!" });

  bcrypt.compare(password, admin.password, (err, isMatch) => {
    if (isMatch) {
      currency
        .deleteOne()
        .then((response) => {
          res.status(200).json({ status: 1, message: "currency delete success" });
        })
        .catch((err) => {
          res.status(400).json({ status: 0, message: "currency not deleted!" });
        });
    } else {
      res.status(401).json({ status: 0, message: "Invalid password!" });
    }
  });
});
