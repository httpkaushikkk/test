const asyncHandler = require("express-async-handler");
const User = require("../../../modals/authenticator/user");
const Game = require("../../../modals/game/index");

// ^ select game of user
exports.selectGame = asyncHandler(async (req, res, next) => {
  const { _id, user_id } = req.body;
  const checkUser = await User.findOne({ _id: user_id });
  if (!checkUser)
    return res.status(400).json({ status: 0, message: "User not found!" });
  const checkGame = await Game.findOne({ _id });
  if (!checkGame)
    return res.status(400).json({ status: 0, message: "Game not found!" });

  // add game for ref
  await User.findByIdAndUpdate({ _id: user_id }, { $set: { games: _id } })
    .then((response) => {
      res.status(200).json({ status: 1, message: "success!" });
    })
    .catch((err) => {
      res.status(400).json({ status: 0, message: err.message });
    });
});
