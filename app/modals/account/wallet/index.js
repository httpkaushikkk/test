const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    balance: { type: number },
    currency: [{ type: mongoose.Schema.Types.ObjectId, ref: "Currency" }],
  },
  {
    timestamps: true,
  }
);

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;