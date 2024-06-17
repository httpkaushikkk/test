const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    name: { type: String },
    email: { type: String },
    mobile: { type: String },
    profile_img: { type: String },
    password: { type: String },
    country: { type: String },
    is_active: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "permissions" }],
    games: [{ type: mongoose.Schema.Types.ObjectId, ref: "Games" }],
    active_games: [{ type: mongoose.Schema.Types.ObjectId, ref: "Games" }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
