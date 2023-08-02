const crypto = require("node:crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const esquemaRegistro = require("../schemas/nuevousuario.js");
const { crearUsuario, actualizarCodigo } = require("../db/queries/queriesusuarios.js");
const { validacionUsuario } = require("../helpers/validacionemail.js");

const sendMail = require("../servicios/envioemail.js");
const { func } = require("joi");

// Controlador de registro de usuarios
async function registro(req, res, next) {
  try {
    await esquemaRegistro.validateAsync(req.body);
    const { name, email, password, avatar } = req.body;

    //Generar codigo de registro
    const codigoRegistro = crypto.randomUUID();

    //Encriptamos contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    //Guardamos en la BD
    const usuario = await crearUsuario({
      name,
      email,
      passwordHash,
      codigoRegistro,
      avatar,
    });

    //Creamos asunto y cuerpo de email de verificacion
    const emailAsunto = "activa tu usuario";
    const emailCuerpo = validacionUsuario(name, codigoRegistro);

    //Enviamos el email de verificacion
    const emailVerificacion = await sendMail(email,emailAsunto, emailCuerpo);
    if(emailVerificacion instanceof Error) throw emailVerificacion
    res.send({
        status: "ok",
        message: "usuario creado, revisa el email de verificación"
    })
  } catch (error) {
    next(error);
  }
}

async function validarCodigo(req, res, next) {
    try {
        // Cogemos el codigo de registro de los params
        const {codigoRegistro} = req.params;
        // Activamos el usuario
        await actualizarCodigo(codigoRegistro);

        res.json({
            status: "ok",
            message: "Usuario activado"
        })
    } catch (error) {
        next(error)
    }


}

module.exports = { registro, validarCodigo };
