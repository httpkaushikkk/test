const asyncHandler = require("express-async-handler");
const LinkReport = require("../../../modals/report/link_report");

// ^ fetch report
exports.fetchReport = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;
  await LinkReport.findOne({ user: { $in: [_id] } })
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

// ^ fetch all report
exports.fetchAllReport = asyncHandler(async (req, res, next) => {
  await LinkReport.find()
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
