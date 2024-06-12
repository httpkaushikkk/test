const mongoose = require("mongoose");

const transactionsSchema = new mongoose.Schema(
  {
    wallet: [{ type: mongoose.Schema.Types.ObjectId, ref: "Wallet" }],
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    currency: [{ type: mongoose.Schema.Types.ObjectId, ref: "Currency" }],
    game: [{ type: mongoose.Schema.Types.ObjectId, ref: "Games" }],
    razorpay_payment_id: { type: String },
    razorpay_order_id: { type: String },
    razorpay_signature: { type: String },
    amount: { type: Number },
    is_credit: { type: Boolean },
    is_debit: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

const Transactions = mongoose.model("Transactions", transactionsSchema);
module.exports = Transactions;
