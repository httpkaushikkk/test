const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  // secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "kareem17@ethereal.email",
    pass: "J4r1vtYzNRtM6pCNvn",
  },
});
