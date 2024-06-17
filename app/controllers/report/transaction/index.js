const Transaction = require("../../../modals/account/transactions");
const User = require("../../../modals/authenticator/user");
const asyncHandler = require("express-async-handler");

// ^ create report
exports.createTransactionReport = asyncHandler(async (req, res, next) => {
  const { user_id } = req.body;
  try {
    const transactions = await Transaction.find({ user: { $in: [user_id] } })
      .populate("game")
      .populate("currency")
      .exec();
    res.status(200).json({ response: transactions, status: 1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
