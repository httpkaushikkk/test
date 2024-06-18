const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mcoder004@gmail.com",
        pass: "jxai qlwx ujiv pjsw",
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });

    console.log("Email sent successfully!");
  } catch (err) {
    console.log("Email not sent");
    console.log(err);
  }
};
