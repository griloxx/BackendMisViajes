const express = require("express");
const router = express.Router();
const controlador = require("../controller/usuarioscontroller");
const autenticacion = require("../milddlewares/autenticacion");
const usuarioExiste = require("../milddlewares/usuarioExiste");
const auth = require("../milddlewares/auth");

//Registro de usuario
router.post("/registro", controlador.registro);
//Validar registro
router.get("/validacion/:codigoRegistro", controlador.validarCodigo);

// Login de usuario
router.post("/login", controlador.login);

// Ruta datos usuario
router.get(
  "/usuario",
  autenticacion,
  usuarioExiste,
  auth,
  controlador.usuario
);

// Modificar perfil
router.put(
  "/perfil",
  autenticacion,
  usuarioExiste,
  auth,
  controlador.modificarPerfil
);

// Eliminar avatar
router.delete(
  "/borrar/avatar",
  autenticacion,
  usuarioExiste,
  auth,
  controlador.deleteAvatar
);

module.exports = router;
