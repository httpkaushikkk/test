const asyncHandler = require("express-async-handler");
const LinkReport = require("../../../modals/report/link_report");

// ^ fetch report
exports.createGameReport = asyncHandler(async (req, res, next) => {
  const { user_id } = req.body;
  await LinkReport.find({ user: { $in: [user_id] } })
    .populate("game")
    .populate("user")
    .exec()
    .then((response) => {
      res.status(200).json({ status: 1, response, message: "success" });
    })
    .catch((err) => {
      res.status(400).json({ status: 0, message: err.message });
    });
});
