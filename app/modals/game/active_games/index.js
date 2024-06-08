const mongoose = require("mongoose");

const activeGamesSchema = new mongoose.Schema(
  {
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    game: [{ type: mongoose.Schema.Types.ObjectId, ref: "Games" }],
    game_url: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ActiveGame = mongoose.model("ActiveGame", activeGamesSchema);
module.exports = ActiveGame;
