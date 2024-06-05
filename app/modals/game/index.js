const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  path: { type: String, required: true },
});

const gameSchema = new mongoose.Schema(
  {
    name: { type: String },
    title: { type: String },
    description: { type: String },
    game_url: { type: String },
    game_icon: { type: String },
    poster: [imageSchema],
    is_active: { type: Boolean, default: true },
    is_under_review: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Games = mongoose.model("Games", gameSchema);
module.exports = Games;
