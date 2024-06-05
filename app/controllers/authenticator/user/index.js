const bcryptPassword = require("../../../utils/bcrypt_password");
const checkStatus = require("../../../middleware/check_status");
const generateToken = require("../../../utils/generate_token");
const { userSchema, userLoginSchema } = require("./validate");
const User = require("../../../modals/authenticator/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

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
  // joi validation
  // const { error } = userSchema.validate(req.body);
  // if (error) {
  //   return res.status(400).json({ status: 0, error: error.details[0].message });
  // }

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
      // generate token
      const token = generateToken(
        {
          id: user._id,
        },
        process.env.JWT_LOGIN_TOKEN,
        process.env.JWT_LOGIN_TOKEN_TIME
      );
      res.status(200).json({
        status: 1,
        data: { token, user },
        message: "User Create Success!",
      });
    }
  } catch (err) {
    res.status(500).json({ status: 0, message: err.message });
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
  checkStatus(res, user.is_active);

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
  checkStatus(res, user.is_active);

  await User.findOne({ _id })
    .then((response) => {
      res.status(200).json({ status: 1, response });
    })
    .catch((err) => {
      res.status(200).json({ status: 0, message: "User profile not found" });
    });
});

// ^ edit user
exports.editUser = asyncHandler(async (req, res, next) => {
  const { _id, username, name, mobile, profile_img, is_active } = req.body;

  const user = await User.findOne({ _id });
  if (!user) return res.json({ status: 1, message: "User not find!" });

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
      },
    }
  )
    .then((response) => {
      res.status(200).json({ status: 1, message: "update success." });
    })
    .catch((err) => {
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
