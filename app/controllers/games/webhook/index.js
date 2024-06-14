const LinkReport = require("../../../modals/report/link_report");
const ActiveGame = require("../../../modals/game/active_games");
const Transaction = require("../../../modals/account/transactions");
const Wallet = require("../../../modals/account/wallet");
const User = require("../../../modals/authenticator/user");
const asyncHandler = require("express-async-handler");
const Game = require("../../../modals/game/index");
const crypto = require("crypto-js");
const path = require("path");

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

const makeCharges = async (req, res, next) => {
  const { id, user_id } = req.params;
  const checkWallet = await Wallet.findOne({ user: { $in: [user_id] } });
  if (!checkWallet)
    return res.status(400).json({ status: 0, message: "Wallet not found!" });
  if (checkWallet.balance > 0) {
    // if (req.session) {
    //   req.session.paymentCompleted = true;
    // }
    await Transaction.create({
      wallet: checkWallet._id,
      user: checkWallet.user[0]._id,
      currency: checkWallet.currency[0]._id,
      game: id,
      razorpay_payment_id: "",
      razorpay_order_id: "",
      razorpay_signature: "",
      amount: 5,
      is_credit: false,
      is_debit: true,
    });
  }
};

// ^ webhook
exports.webhook = asyncHandler(async (req, res, next) => {
  apiCallCount++;
  const { folder, file, id, user_id } = req.params;
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

  // check url disable or not?
  const checkURL = await ActiveGame.findOne({ game_url: fullUrl });
  if (!checkURL.is_active) {
    // return res.status(400).json({ status: 0, message: "Game is disable!" });
    return res.sendFile(__dirname + "/index.html");
  }

  // fetch wallet and charge for open link money
  const checkWallet = await Wallet.findOne({ user: { $in: [user_id] } });
  if (!checkWallet)
    return res.status(400).json({ status: 0, message: "Wallet not found!" });
  if (checkWallet.balance > 0) {
    checkWallet.balance = checkWallet.balance - 5;
    await checkWallet.save();
  }

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

  makeCharges(req, res, next);

  let paths = gameUrl.replace(/\\/g, "/");
  // const hash = crypto.SHA256(path).toString();
  res.redirect(`http://localhost:8100/${paths}`);
});
