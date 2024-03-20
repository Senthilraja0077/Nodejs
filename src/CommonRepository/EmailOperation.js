const nodemailer = require("nodemailer");
const sendEmail = async (option) => {
  // CREATE A TRANSPORTER - RESPOSIBLE FOR SENDING MAIL
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // DEFINR EMAIL OPTIONS
  const emailOptions = {
    from: "user suppoer<support@user.com>",
    to: option.email,
    subject: option.subject,
    text: option.message,
  };
  await transporter.sendMail(emailOptions);
};
module.exports = sendEmail;
