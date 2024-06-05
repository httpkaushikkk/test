const asyncHandler = require("express-async-handler");
const { gameSchema } = require("./protect");
const Games = require("../../modals/game");
const Admin = require("../../modals/authenticator/admin");

// ^ add games
exports.addGames = asyncHandler(async (req, res, next) => {
  // joi validation
  // const { error } = gameSchema.validate(req.body);
  // if (error) {
  //   return res.status(400).json({ error: error.details[0].message });
  // }
  const { _id, name, title, description, game_url, game_icon, poster } =
    req.body;
  const check = await Admin.findOne({ _id });
  if (!check) {
    return res.status(400).json({ status: 0, message: "User not found!" });
  }

  try {
    const game = await Games.create({
      name,
      title,
      description,
      game_url,
      game_icon,
      poster,
    });
    res
      .status(200)
      .json({ status: 1, game, message: "Game add successfully!" });
  } catch (err) {
    res.status(500).json({ status: 0, error: err.message });
  }
});

// ^ edit games
exports.editGames = asyncHandler(async (req, res, next) => {
  const {
    _id,
    name,
    title,
    description,
    game_url,
    is_active,
    is_under_review,
  } = req.body;

  const game = await Games.findById({ _id });
  if (!game)
    return res.status(400).json({ status: 0, message: "Game not found!" });

  await Games.findByIdAndUpdate(
    { _id },
    { $set: { name, title, description, game_url, is_active, is_under_review } }
  )
    .then((response) => {
      res.status(200).json({
        message: "update success.",
      });
    })
    .catch((err) => {
      res.status(400).json({ status: 0, message: err });
    });
});

// ^ fetch games
exports.fetchGames = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;
  await Games.findOne({ _id })
    .then((response) => {
      res.status(200).json({
        message: "fetch success.",
        response,
      });
    })
    .catch((err) => {
      res.status(400).json({ status: 0, message: err });
    });
});

// ^ fetch all games
exports.fetchAllGames = asyncHandler(async (req, res, next) => {
  await Games.find()
    .then((response) => {
      res.status(200).json({
        message: "fetch success.",
        response,
      });
    })
    .catch((err) => {
      res.status(400).json({ status: 0, message: err });
    });
});

// ^ delete games
exports.gameDelete = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;
  const check = await Games.findOne({ _id });
  if (!check)
    return res.status(400).json({ status: 0, message: "Game not found!" });

  check
    .deleteOne()
    .then((response) => {
      res.status(200).json({
        message: "delete success.",
      });
    })
    .catch((err) => {
      res.status(400).json({ status: 0, message: err });
    });
});
