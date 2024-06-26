const ActiveGame = require("../../../modals/game/active_games");
const asyncHandler = require("express-async-handler");

// ^ fetch active games
exports.fetchActiveGames = asyncHandler(async (req, res, next) => {
  const { _id, game_id } = req.body;
  //   const checkUser = await ActiveGame.findOne({ user: { $in: [_id] }, game: { $in: [game_id] } });
  //   if (!checkUser)
  //     return res.status(400).json({ status: 0, message: "User not found!" });

  await ActiveGame.findOne({ user: { $in: [_id] }, game: { $in: [game_id] } })
    .populate("user")
    .populate("game")
    .exec()
    .then((response) => {
      res.status(200).json({ status: 1, response, message: "success" });
    })
    .catch((err) => {
      res.status(400).json({ status: 0, message: err.message });
    });
});

// ^ fetch all active games
exports.fetchAllActiveGames = asyncHandler(async (req, res, next) => {
  await ActiveGame.find()
    .then((response) => {
      res.status(200).json({ status: 1, response, message: "success" });
    })
    .catch((err) => {
      res.status(400).json({ status: 0, message: err.message });
    });
});

// ^ edit active games
exports.editActiveGames = asyncHandler(async (req, res, next) => {
  const { _id, user_id, game_id, is_active } = req.body;
  const checkUser = await ActiveGame.findOne({ user: { $in: [user_id] } });
  if (!checkUser)
    return res.status(400).json({ status: 0, message: "User not found!" });
  const checkGame = await ActiveGame.findOne({ game: { $in: [game_id] } });
  if (!checkGame)
    return res.status(400).json({ status: 0, message: "Game not found!" });

  await ActiveGame.findByIdAndUpdate({ _id }, { $set: { is_active } })
    .then((response) => {
      if (response.is_active == false) {
        res.status(200).json({
          message: "URL is enable",
        });
      } else {
        res.status(200).json({
          message: "URL is disabled",
        });
      }
    })
    .catch((err) => {
      res.status(400).json({ status: 0, message: err.message });
    });
});
