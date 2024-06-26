const bcrypt = require("bcrypt");
const { walletSchema } = require("./validate");
const asyncHandler = require("express-async-handler");
const Wallet = require("../../../modals/account/wallet");
const User = require("../../../modals/authenticator/user");
const Admin = require("../../../modals/authenticator/admin");
const Currency = require("../../../modals/account/currency");
const checkStatus = require("../../../middleware/check_status");

// ^ create wallet
exports.addWallet = asyncHandler(async (req, res, next) => {
  // joi validation
  // const { error } = walletSchema.validate(req.body);
  // if (error) {
  //   return res.status(400).json({ error: error.details[0].message });
  // }
  const { user } = req.body;

  const checkUser = await User.findOne({ _id: user });
  if (!checkUser)
    return res.status(400).json({ status: 0, error: "User not found!" });
  // checkStatus(res, user.is_active);

  const fetchCurrency = await Currency.find();
  if (!fetchCurrency)
    return res.status(400).json({ status: 0, error: "Currency not found!" });

  let currencyId = fetchCurrency[0]._id;
  let balance = 0;

  try {
    const wallet = await Wallet.create({ user, balance, currency: currencyId });
    res.status(200).json({ status: 1, wallet });
  } catch (err) {
    res.status(500).json({ status: 0, error: err.message });
  }
});

// ^ edit wallet
exports.editWallet = asyncHandler(async (req, res, next) => {
  const { _id, user_id, balance } = req.body;

  const user = await User.findOne({ _id: user_id });
  if (!user)
    return res.status(400).json({ status: 0, error: "User not found!" });

  const wallet = await Wallet.findOne({ _id });
  if (!wallet)
    return res.status(400).json({ status: 0, error: "wallet not found!" });

  await Wallet.findOneAndUpdate(
    {
      _id,
    },
    {
      $set: { balance },
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

// ^ fetch wallet
exports.fetchWallet = asyncHandler(async (req, res, next) => {
  const { user_id } = req.body;

  const user = await User.findOne({ _id: user_id });
  if (!user)
    return res.status(400).json({ status: 0, error: "User not found!" });

  const wallet = await Wallet.findOne({ user: { $in: [user_id] } });
  if (!wallet)
    return res.status(400).json({ status: 0, error: "wallet not found!" });

  await Wallet.findOne({ user: { $in: [user_id] } })
    .populate("currency")
    .populate("transections")
    .populate("user")
    .exec()
    .then((response) => {
      res.status(200).json({
        status: 1,
        response,
      });
    })
    .catch((err) => {
      res.status(404).json({ status: 0, error: "Wallet not found" });
    });
});

// ^ fetch all wallet
exports.fetchAllWallet = asyncHandler(async (req, res, next) => {
  const { admin_id } = req.body;

  const admin = await Admin.findOne({ _id: admin_id });
  // checkStatus(res, admin.status);

  await Wallet.find()
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

// ^ delete wallet
exports.deleteWallet = asyncHandler(async (req, res, next) => {
  const { _id, user_id, password } = req.body;

  const user = await User.findOne({ _id: user_id });
  // checkStatus(res, user.is_active);

  const wallet = await Wallet.findOne({ _id });
  if (!wallet)
    return res.status(400).json({ status: 0, message: "wallet not found!" });

  bcrypt.compare(password, user.password, (err, isMatch) => {
    if (isMatch) {
      wallet
        .deleteOne()
        .then((response) => {
          res.status(200).json({ status: 1, message: "wallet delete success" });
        })
        .catch((err) => {
          res.status(400).json({ status: 0, message: "wallet not deleted!" });
        });
    } else {
      res.status(401).json({ status: 0, message: "Invalid password!" });
    }
  });
});
