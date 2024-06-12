const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    balance: { type: Number },
    currency: [{ type: mongoose.Schema.Types.ObjectId, ref: "Currency" }],
    transections: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Transactions" },
    ],
  },
  {
    timestamps: true,
  }
);

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;
