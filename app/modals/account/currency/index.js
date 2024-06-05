const mongoose = require("mongoose");

const currencySchema = new mongoose.Schema(
  {
    name: { type: String },
    short_name: { type: String },
    status: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);

const Currency = mongoose.model("Currency", currencySchema);
module.exports = Currency;
