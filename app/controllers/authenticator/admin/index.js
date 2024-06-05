const generateRandomPassword = require("../../../utils/random_pass");
const bcryptPassword = require("../../../utils/bcrypt_password");
const checkStatus = require("../../../middleware/check_status");
const { adminSchema, adminLoginSchema } = require("./validate");
const generateToken = require("../../../utils/generate_token");
const Admin = require("../../../modals/authenticator/admin");
const asyncHandler = require("express-async-handler");
const transporter = require("../../../middleware/transporter");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

// ^ add admin
exports.addAdmin = asyncHandler(async (req, res, next) => {
  // joi validation
  const { error } = adminSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { name, email, mobile, password, permissions } = req.body;

  // check mobile alredy exits
  const checkMobile = await Admin.findOne({ mobile });
  if (checkMobile)
    return res.status(400).json({ status: 0, message: "Mobile alredy exits!" });
  const checkEmail = await Admin.findOne({ email });
  if (checkEmail)
    return res.status(400).json({ status: 0, message: "Email alredy exits!" });

  // add permission
  let permissionData = [];
  if (permissions && permissions.lenght != 0) {
    for (let i = 0; i < permissions.length; i++) {
      permissionData.push({
        _id: permissions[i]._id,
        name: permissions[i].name,
        action_name: permissions[i].action_name
      });
    }
  }

  try {
    // const password = generateRandomPassword();
    const bcryptPass = await bcryptPassword(password);
    const admin = await Admin.create({
      name,
      email,
      mobile,
      password: bcryptPass,
      permission: permissionData,
    });
    res.status(200).json({
      status: 1,
      admin,
      message: "User create suceess.",
    });
  } catch (err) {
    res.status(500).json({ status: 0, error: err.message });
  }
});

// ^ login admin
exports.loginAdmin = asyncHandler(async (req, res, next) => {
  // joi validation
  const { error } = adminLoginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email, password } = req.body;

  const admin = await Admin.findOne({
    email: email,
  }).select("+password");

  if (!admin)
    return res.status(401).json({ status: 0, error: "User not found" });
  
  await checkStatus(res, admin.status);

  bcrypt.compare(password, admin.password, (err, isMatch) => {
    if (isMatch) {
      const token = generateToken(
        {
          id: admin._id,
        },
        process.env.JWT_LOGIN_TOKEN,
        process.env.JWT_LOGIN_TOKEN_TIME
      );
      res.status(200).json({ status: 1, token, admin });
    } else {
      res.status(401).json({ status: 0, error: "Invalid credentials!" });
    }
  });
});

// ^ fetch single admin
exports.fetchAdmin = asyncHandler(async (req, res, next) => {
  const { _id } = req.body;

  const admin = await Admin.findOne({ _id });

  // check user active status
  checkStatus(res, admin.status);

  await Admin.findOne({ _id })
    .then((response) => {
      res.status(200).json({
        status: 1,
        response,
      });
    })
    .catch((err) => {
      res.status(404).json({
        status: 0,
        error: "User profile not found",
      });
    });
});

// ^ edit admin
exports.editAdmin = asyncHandler(async (req, res, next) => {
  const { _id, name, mobile, status } = req.body;

  const admin = await Admin.findById({ _id });
  if (!admin)
    return res.status(400).json({ status: 0, message: "User not found!" });

  // check user active status
  // checkStatus(res, admin.status);

  await Admin.findOneAndUpdate(
    {
      _id,
    },
    {
      $set: { name, mobile, status },
    }
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

// ^ fetch all admin
exports.fetchAllAdmin = asyncHandler(async (req, res, next) => {
  await Admin.find()
    .then((response) => {
      res.status(200).json({
        status: 1,
        response,
      });
    })
    .catch((err) => {
      res.status(404).json({ status: 0, error: "Users not found" });
    });
});

// ^ delete admin
exports.deleteAdmin = asyncHandler(async (req, res, next) => {
  const { _id, password } = req.body;
  const admin = await Admin.findById({ _id });
  if (!admin)
    return res.status(400).json({ status: 0, message: "User not found!" });

  // check user active status
  checkStatus(res, admin.status);

  admin
    .deleteOne()
    .then((response) => {
      res.status(200).json({ status: 1, message: "User delete success" });
    })
    .catch((err) => {
      res.status(400).json({ status: 0, message: "User not deleted!" });
    });

  // bcrypt.compare(password, admin.password, (err, isMatch) => {
  //   if (isMatch) {
  //   } else {
  //     res.status(401).json({ status: 0, message: "Invalid password!" });
  //   }
  // });
});

// async function sendResetEmail(email, token) {
//   const resetLink = `https://yourwebsite.com/reset-password?token=${token}`;

//   const mailOptions = {
//     from: "your-email@example.com",
//     to: email,
//     subject: "Password Reset Request",
//     text: `Click here to reset your password: ${resetLink}`,
//   };

//   await transporter.sendMail(mailOptions);
// }

// // ^ send mail
// exports.sendMail = asyncHandler(async (req, res, next) => {
//   const { email } = req.body;

//   try {
//     const check = await Admin.findOne({ email });
//     if (!check)
//       return res.status(400).json({ status: 0, message: "Email not found!" });
//     checkStatus(res, check.status);

//     const token = generateResetToken();
//     const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds

//     await Admin.updateOne({ resetToken: token, resetTokenExpiry: expiry });

//     await sendResetEmail(email, token);

//     res
//       .status(200)
//       .json({ status: 1, message: "Password reset link sent successfully" });
//   } catch (err) {
//     res.status(500).send("Internal server error");
//   }
// });

// // ^ forgot password
// exports.resetPassword = asyncHandler(async (req, res, next) => {
//   const { token, password } = req.body;

//   const check = await Admin.findOne({ email });
//   if (!check)
//     return res.status(400).json({ status: 0, message: "User not found!" });

//   // check user active status
//   checkStatus(res, check.status);

//   const bcryptPass = await bcryptPassword(password);

//   await Admin.findOneAndUpdate(
//     {
//       email,
//     },
//     {
//       $set: { password: bcryptPass },
//     }
//   )
//     .then((response) => {
//       res.status(200).json({
//         message: "Reset password success.",
//       });
//     })
//     .catch((err) => {
//       res.status(400).json({ status: 0, message: err });
//     });
// });