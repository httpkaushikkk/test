const Transaction = require("../../../modals/account/transactions");
const Wallet = require("../../../modals/account/wallet");
const User = require("../../../modals/authenticator/user");
const asyncHandler = require("express-async-handler");
const { transactionSchema } = require("./validate");

// ^ add transaction
exports.add = asyncHandler(async (req, res, next) => {
  // joi validation
  // const { error } = transactionSchema.validate(req.body);
  // if (error) return res.status(400).json({ error: error.details[0].message });

  const {
    wallet,
    user,
    currency,
    game,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    amount,
    is_credit,
    is_debit,
  } = req.body;

  const CheckUser = await User.findOne({ _id: user });
  if (!CheckUser)
    return res.status(500).json({ status: 0, error: "User not found!" });

  try {
    const transaction = await Transaction.create({
      wallet,
      user,
      currency,
      game,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      amount,
      is_credit,
      is_debit,
    });

    const fetchWallet = await Wallet.findOne({ _id: wallet });
    if (!fetchWallet)
      return res.status(500).json({ status: 0, error: "Wallet not found!" });
    fetchWallet.balance = fetchWallet.balance + parseInt(amount);
    fetchWallet.transections = [...fetchWallet.transections, transaction._id];
    await fetchWallet.save();

    res.status(200).json({
      status: 1,
      transaction,
      message: "transaction create suceess.",
    });
  } catch (err) {
    res.status(500).json({ status: 0, error: err.message });
  }
});

// ^ edit transaction
exports.edit = asyncHandler(async (req, res, next) => {
  const { _id, amount } = req.body;

  const transaction = await Transaction.findOne({ _id });
  if (!transaction)
    return res.status(500).json({ status: 0, error: "Transaction not found!" });

  await Transaction.findOneAndUpdate(
    {
      _id,
    },
    {
      amount,
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

// fetch transaction
exports.fetch = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;
  await Transaction.findOne({ _id })
    .then((response) => {
      res.status(200).json({
        response,
        message: "fetch success.",
      });
    })
    .catch((err) => {
      res.status(500).json({ status: 0, error: err.message });
    });
});

// fetch all transaction
exports.fetchAll = asyncHandler(async (req, res, next) => {
  await Transaction.find()
    .populate("wallet")
    .populate("user")
    .populate("currency")
    .populate("game")
    .then((response) => {
      res.status(200).json({
        response,
        message: "fetch success.",
      });
    })
    .catch((err) => {
      res.status(500).json({ status: 0, error: err.message });
    });
});

// delete transaction
exports.deleteTransaction = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;

  const check = await Transaction.findOne({ _id });
  if (!check)
    return res.status(500).json({ status: 0, error: "Transaction not found!" });

  check
    .deleteOne()
    .then((response) => {
      res.status(200).json({ message: "delete success." });
    })
    .catch((err) => {
      res.status(500).json({ status: 0, error: err.message });
    });
});
