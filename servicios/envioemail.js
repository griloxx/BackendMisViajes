const nodeMailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid");

const {
    SMPT_USER,
    SENDGRID_KEY,
} = process.env

const transporte = nodeMailer.createTransport(
    sendGridTransport({
        apiKey: SENDGRID_KEY
    })
)

async function enviarEmail(email, asunto, cuerpo){
    try {
        const opciones = {
            from: SMPT_USER,
            to: email,
            asunto,
            text: cuerpo
        }
        await transporte.enviarEmail(opciones)
    } catch (error) {
        return (error)
    }
}

module.exports = enviarEmail;