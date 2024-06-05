const Transaction = require("../../../modals/account/transactions");
const User = require("../../../modals/authenticator/user");
const asyncHandler = require("express-async-handler");
const { transactionSchema } = require("./validate");

// ^ add transaction
exports.add = asyncHandler(async (req, res, next) => {
  // joi validation
  const { error } = transactionSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const {
    wallet_id,
    user_id,
    gateway_payment_id,
    amount,
    currency,
    transaction_type,
  } = req.body;

  const user = await User.findOne({ _id: user_id });
  if (!user)
    return res.status(500).json({ status: 0, error: "User not found!" });

  try {
    const transaction = await Transaction.create({
      wallet_id,
      user_id,
      gateway_payment_id,
      amount,
      currency,
      transaction_type,
    });
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
