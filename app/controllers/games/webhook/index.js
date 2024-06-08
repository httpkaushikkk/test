const LinkReport = require("../../../modals/report/link_report");
const ActiveGame = require("../../../modals/game/active_games");
const User = require("../../../modals/authenticator/user");
const asyncHandler = require("express-async-handler");
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
    return res.status(400).json({ status: 0, message: "Game not found!" });

  const link = `http://localhost:8100/v1/api/${checkGame.game_url}/${game_id}/${_id}`;
  let url = link.replace(/\\/g, "/");
  url = encodeURI(url);

  await ActiveGame.create({ user: _id, game: game_id, game_url: url })
    .then(async (response) => {
      await User.findByIdAndUpdate(
        { _id },
        { $set: { active_games: [...checkUser.active_games, game_id] } }
      );
      res.status(200).json({ status: 1, url, message: "success" });
    })
    .catch((err) => {
      res.status(400).json({ status: 0, message: err });
    });
});

// ^ webhook
exports.webhook = asyncHandler(async (req, res, next) => {
  apiCallCount++;
  const { folder, file, id, user_id } = req.params;

  const checkGame = await Game.findOne({ _id: id });
  if (!checkGame)
    return res.status(400).json({ status: 0, message: "Game not found!" });

  const checkUser = await User.findOne({ _id: user_id }).populate("games");
  if (!checkGame)
    return res.status(400).json({ status: 0, message: "User not found!" });

  let gameUrl = "";

  if (checkUser && checkUser.games.length !== 0) {
    for (let i = 0; i < checkUser.games.length; i++) {
      if (checkUser.games[i]._id == id) {
        gameUrl = checkUser.games[i].game_url;
      }
    }
  }

  if (gameUrl == "") {
    return res.status(400).json({ status: 0, message: "access denied!" });
  }

  const checkReportHave = await LinkReport.findOne({
    user: { $in: [user_id] },
    game_url: gameUrl,
  });

  if (!checkReportHave) {
    await LinkReport.create({
      user: checkUser,
      game: checkUser.games.filter((e) => e._id == id),
      game_url: gameUrl,
      open_count: 1,
    });
  } else {
    checkReportHave.open_count += 1;
    await checkReportHave.save();
  }

  let path = gameUrl.replace(/\\/g, "/");
  res.redirect(`http://localhost:8100/${path}`);
});
