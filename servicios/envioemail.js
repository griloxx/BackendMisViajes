const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid");

const { SMPT_USER, SENDGRID_KEY } = process.env;

const transporte = nodemailer.createTransport(
  sendGridTransport({
    apiKey: SENDGRID_KEY,
  })
);

async function sendMail(email, subject, cuerpo) {
  try {
    const opciones = {
      from: SMPT_USER,
      to: email,
      subject,
      text: cuerpo,
    };

    await transporte.sendMail(opciones);
  } catch (error) {
    return error;
  }
}

module.exports = sendMail;
