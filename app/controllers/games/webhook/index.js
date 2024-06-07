const asyncHandler = require("express-async-handler");
const User = require("../../../modals/authenticator/user");
const Game = require("../../../modals/game/index");

let apiCallCount = 0;

// ^ add games
exports.generateLink = asyncHandler(async (req, res, next) => {
  const { _id, game_id } = req.body;
  const checkUser = await User.findOne({ _id });
  if (!checkUser)
    return res.status(400).json({ status: 0, message: "User not found!" });
  const checkGame = await Game.findOne({ _id: game_id });
  if (!checkGame)
    res.status(400).json({ status: 0, message: "Game not found!" });

  const link = `http://localhost:8100/${checkGame.game_url}/${game_id}`;
  let url = link.replace(/\\/g, "/");
  url = encodeURI(url);
  res.status(200).json({ status: 1, url, message: "success" });
});

// ^ webhook
exports.webhook = asyncHandler(async (req, res, next) => {
  apiCallCount++;
  const { folder, file, id } = req.params;

  const checkGame = await Game.findOne({ _id: id });
  if (!checkGame)
    return res.status(400).json({ status: 0, message: "Game not found!" });

  let gameUrl = "";

  const checkUser = await User.findOne({ games: { $in: [id] } })
    .populate("games")
    .exec();
  if (checkUser && checkUser.games.length !== 0) {
    for (let i = 0; i < checkUser.games.length; i++) {
      if (checkUser.games[i]._id == id) {
        gameUrl = checkUser.games[i].game_url;
      } else {
        return res.status(400).json({ status: 0, message: "access denied!" });
      }
    }
  }

  console.log(apiCallCount);

  let path = gameUrl.replace(/\\/g, "/");
  res.redirect(`http://localhost:8100/${path}`);
});
