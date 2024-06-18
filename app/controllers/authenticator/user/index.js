const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Game = require("../../../modals/game");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../../../utils/send_email");
const User = require("../../../modals/authenticator/user");
const Token = require("../../../modals/authenticator/token");
const { userSchema, userLoginSchema } = require("./validate");
const generateToken = require("../../../utils/generate_token");
const checkStatus = require("../../../middleware/check_status");
const bcryptPassword = require("../../../utils/bcrypt_password");

// ^ check username
exports.checkUsername = asyncHandler(async (req, res, next) => {
  const { username } = req.body;
  const check = await User.findOne({ username });
  if (check)
    return res
      .status(409)
      .json({ status: 0, message: "username not available!" });
  res.status(200).json({ status: 1, message: "username is available!" });
});

// ^ register user
exports.register = asyncHandler(async (req, res, next) => {
  const { username, name, email, mobile, country, password, is_create_admin } =
    req.body;

  // check user alredy exits or not
  const check = await User.findOne({ username, email });
  if (check)
    return res.status(400).json({ status: 0, message: "User alredy exits!" });

  try {
    const bcryptPass = await bcryptPassword(password);
    const user = await User.create({
      username,
      name,
      email,
      mobile,
      country,
      password: bcryptPass,
    });
    if (is_create_admin) {
      res.status(200).json({
        status: 1,
        data: user,
        message: "User Create Success!",
      });
    } else {
      const token = await new Token({
        user_id: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();

      const url = `${process.env.BASE_URL}verify/${user._id}/${token.token}`;
      await sendEmail(user.email, "Verify Email", url);

      res
        .status(201)
        .send({ message: "An email sent to your account please verify" });
    }
  } catch (err) {
    res.status(500).json({ status: 0, message: err.message });
  }
});

// ^ verify user
exports.verifyUser = asyncHandler(async (req, res, next) => {
  console.log(req.url);
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).json({ message: "Invalid link" });

    const token = await Token.findOne({
      user_id: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).json({ message: "Invalid link" });

    await User.updateOne({ _id: user._id, verified: true });
    // await token.deleteOne();

    res.status(200).send({ message: "Email verified Successfully!" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// ^ login user
exports.login = asyncHandler(async (req, res, next) => {
  // joi validation
  const { error } = userLoginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ status: 0, error: error.details[0].message });
  }

  const { username, email, password } = req.body;

  // check user exits or not
  let user;
  if (username) {
    user = await User.findOne({ username });
    if (!user)
      return res.status(401).json({ status: 0, error: "User not found" });
  } else if (email) {
    user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ status: 0, error: "User not found" });
  }

  // check user active status
  // checkStatus(res, user.is_active);

  if (!user.verified) {
    let token = await Token.findOne({ user_id: user._id });
    if (!token) {
      const token = await new Token({
        user_id: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();

      const url = `${process.env.BASE_URL}verify/${user._id}/${token.token}`;
      await sendEmail(user.email, "Verify Email", url);
    }
    return res
      .status(400)
      .send({ message: "An email sent to your account please verify" });
  }

  bcrypt.compare(password, user.password, (err, isMatch) => {
    if (isMatch) {
      const token = generateToken(
        {
          id: user._id,
        },
        process.env.JWT_LOGIN_TOKEN,
        process.env.JWT_LOGIN_TOKEN_TIME
      );
      res.status(200).json({ status: 1, data: { token, user } });
    } else {
      res.status(401).json({ status: 0, message: "Invalid credentials!" });
    }
  });
});

// ^ find single user
exports.fetchUser = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;

  const user = await User.findOne({ _id });

  // check user active status
  // checkStatus(res, user.is_active);

  await User.findOne({ _id })
    .populate("games")
    .populate("active_games")
    .exec()
    .then((response) => {
      res.status(200).json({ status: 1, response });
    })
    .catch((err) => {
      res.status(200).json({ status: 0, message: "User profile not found" });
    });
});

// ^ edit user
exports.editUser = asyncHandler(async (req, res, next) => {
  const { _id, username, name, mobile, profile_img, is_active, game_id } =
    req.body;

  const user = await User.findOne({ _id });
  if (!user) return res.json({ status: 1, message: "User not find!" });

  if (game_id) {
    const checkGame = await Game.findOne({ _id: game_id });
    if (!checkGame) return res.json({ status: 1, message: "Game not find!" });
  }

  // check user active status
  // checkStatus(res, user.is_active);

  await User.findOneAndUpdate(
    {
      _id,
    },
    {
      $set: {
        username,
        name,
        mobile,
        profile_img,
        is_active,
        games: [...user.games, game_id],
      },
    }
  )
    .then((response) => {
      res.status(200).json({ status: 1, message: "success." });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ status: 0, message: "data not update!" });
    });
});

// ^ fetch all user
exports.fetchAllUser = asyncHandler(async (req, res, next) => {
  await User.find()
    .then((response) => {
      res.status(200).json({ status: 1, response });
    })
    .catch((err) => {
      res.status(404).json({ status: 0, message: "Users not found" });
    });
});

// ^ delete user
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { _id, password } = req.body;
  const user = await User.findOne({ _id });
  if (!user)
    return res.status(400).json({ status: 0, message: "User not found!" });

  // check user active status
  checkStatus(res, user.is_active);

  user
    .deleteOne()
    .then((response) => {
      res.status(200).json({ status: 1, message: "User delete success" });
    })
    .catch((err) => {
      res.status(400).json({ status: 0, message: "User not deleted!" });
    });
});
