const mongoose = require("mongoose");

const linkReportSchema = new mongoose.Schema(
  {
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    game: [{ type: mongoose.Schema.Types.ObjectId, ref: "Games" }],
    game_url: { type: String, required: true },
    open_count: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const LinkReport = mongoose.model("LinkReport", linkReportSchema);
module.exports = LinkReport;
