const mongoose = require("mongoose");

const publisherSchema = new mongoose.Schema(
  {
    email: { type: String },
    mobile: { type: String },
    name: { type: String },
    profile_image: { type: String },
    country: { type: String },
    role: { type: String },
    password: { type: String },
    is_active: { type: Boolean, default: true },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "permissions" }],
  },
  {
    timestamps: true,
  }
);

const Publisher = mongoose.model("Publisher", publisherSchema);
module.exports = Publisher;
