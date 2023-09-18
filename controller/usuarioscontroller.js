const crypto = require("node:crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const { RUTA_AVATAR } = process.env;
const path = require("path");

const {
  esquemaRegistro,
  esquemaLogin,
  esquemaEditarPerfil,
} = require("../schemas/esquemasusuarios.js");
const {
  crearUsuario,
  actualizarCodigo,
  getUsuarioBy,
  comprobarActivo,
  editarPerfil,
  avatarEliminado,
  getEntradaByUserId,
  getAllUsuarioBy,
} = require("../db/queries/queriesusuarios.js");
const { validacionUsuario } = require("../helpers/validacionemail.js");

const sendMail = require("../servicios/envioemail.js");
const generarError = require("../helpers/generarError.js");
const guardarAvatar = require("../servicios/avatar.js");
const { getFotosId, getVotosId, yaVotado } = require("../db/queries/queriesentradas.js");

// Controlador de registro de usuarios
async function registro(req, res, next) {
  try {
    await esquemaRegistro.validateAsync(req.body);
    const { name, email, password } = req.body;
    let nombreAvatar;
    let avatar;
    if (req.files?.avatar) {
      ({ avatar } = req.files);
      nombreAvatar = await guardarAvatar(avatar);
    }

    //Generar codigo de registro
    const codigoRegistro = crypto.randomUUID();

    //Encriptamos contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    //Guardamos en la BD
    await crearUsuario({
      name,
      email,
      passwordHash,
      codigoRegistro,
      nombreAvatar,
    });

    //Creamos asunto y cuerpo de email de verificacion
    const emailAsunto = "activa tu usuario";
    const emailCuerpo = validacionUsuario(name, codigoRegistro);

    //Enviamos el email de verificacion
    const emailVerificacion = await sendMail(email, emailAsunto, emailCuerpo);
    if (emailVerificacion instanceof Error) throw emailVerificacion;
    res.send({
      status: "ok",
      message: "usuario creado, revisa el email de verificación",
    });
  } catch (error) {
    next(error);
  }
}
// Controlador para activar usuario
async function validarCodigo(req, res, next) {
  try {
    // Cogemos el codigo de registro de los params
    const { codigoRegistro } = req.params;
    // Activamos el usuario
    await actualizarCodigo(codigoRegistro);

    res.json({
      status: "ok",
      message: "Usuario activado",
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    // Validamos con esquema joi
    await esquemaLogin.validateAsync(req.body);
    const { email, password } = req.body;

    // Consultadomos a la BD que exista ese usuario
    const usuario = await getAllUsuarioBy({ email });

    // Si no existe mensaje común para no dar detalles excesivos por seguridad
    if (!usuario) generarError("Usuario o contraseña errónea.", 401);
    
    // Comparamos contraseñas
    const autorizado = await bcrypt.compare(password, usuario.password);

    // Si no coinciden Mensaje común para no dar detalles excesivos por seguridad
    if (!autorizado) generarError("Usuario o contraseña errónea.", 401);
    
    const usuarioActivado = await comprobarActivo(usuario.id);

    // Si hay codigo de registro lanzamos error
    if (usuarioActivado > 0) generarError("Usuario no activado", 401);
    
    // Creamos objeto con los datos que queremos del usuario en el token
    const tokenInfo = {
      id: usuario.id,
      name: usuario.name,
      avatar: usuario.avatar,
    };

    // Creamos el token firmado
    const token = jwt.sign(tokenInfo, process.env.LLAVE_SECRETA, {
      expiresIn: "1d",
    });

    res.json({
      status: "ok",
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function modificarPerfil(req, res, next) {
  try {
    await esquemaEditarPerfil.validateAsync(req.body);
    const { id } = req.user;
    const { name, password } = req.body;
    let nombreAvatar;
    let passwordHash;

    if (password !== undefined && password.length !== 0) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    let rutaAvatar;
    const oldAvatar = req.user.avatar;
    
    if (oldAvatar) {
      rutaAvatar = path.resolve(__dirname, "../", RUTA_AVATAR, oldAvatar);
    }

    if (req.files?.avatar) {
      oldAvatar && (await fs.unlink(rutaAvatar));
      const { avatar } = req.files;
      nombreAvatar = await guardarAvatar(avatar);
    }
    if(req.body?.avatar === "sinAvatar") {
      oldAvatar && (await fs.unlink(rutaAvatar));
      nombreAvatar = "sinAvatar";
    }
    const actualizarperfil = await editarPerfil(
      id,
      name,
      passwordHash,
      nombreAvatar
    );
    const tokenInfo = {
      id: actualizarperfil.id,
      name: actualizarperfil.name,
      avatar: actualizarperfil.avatar,
    };

    // Creamos el token firmado
    const token = jwt.sign(tokenInfo, process.env.LLAVE_SECRETA, {
      expiresIn: "1d",
    });

    res.json({
      status: "ok",
      message: "Datos actualizados correctamente",
      data: token,
    });
  } catch (error) {
    next(error);
  }
}

async function usuario(req, res, next) {
  try {
    let datos = [];
    const { id } = req.user;

    datos = await getUsuarioBy({id});
    datos.entradas = await getEntradaByUserId({id});
    datos.entradas = await Promise.all(datos.entradas.map(async (entrada) => {
      entrada.fotos = await getFotosId(entrada.id);
      entrada.votos = await getVotosId(entrada.id);
      entrada.yaVotado = await yaVotado(entrada.id, id);

      return entrada
    }))
    
    res.json({
      status: "ok",
      data: datos
    })
  } catch (error) {
    next(error)
  }
}

async function deleteAvatar(req, res, next) {
  try {
    const { id, avatar } = req.user;

    const rutaAvatar = path.resolve(__dirname, "../", RUTA_AVATAR, avatar);

    await fs.unlink(rutaAvatar);
    await avatarEliminado(id);
    res.json({
      status: "ok",
      message: "foto borrada con éxito",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registro,
  validarCodigo,
  login,
  modificarPerfil,
  usuario,
  deleteAvatar,
};
