const mongoose = require("mongoose");

const transactionsSchema = new mongoose.Schema(
  {
    wallet_id: { type: String },
    user_id: { type: String },
    gateway_payment_id: { type: String },
    amount: { type: String },
    currency: { type: String },
    status: { type: String },
    transaction_type: { type: String },
  },
  {
    timestamps: true,
  }
);

const Transactions = mongoose.model("Transactions", transactionsSchema);
module.exports = Transactions;
