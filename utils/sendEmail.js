const nodemailer = require("nodemailer");
require("dotenv").config();
module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      secure: true,
      service: "gmail",
      auth: {
        user: "mruspace001@gmail.com",
        pass: "viec uysg lgvp cbtw",
      },
    });

    await transporter.sendMail({
      from: "mruspace001@gmail.com",
      to: email,
      subject: subject,
      html: `<b>Link on the click to verify your account 😎 : ${text} </b>`,
    });
    console.log("Email sent successfully");
  } catch (err) {
    console.log("Email not sent", err);
  }
};