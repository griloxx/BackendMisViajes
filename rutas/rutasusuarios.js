const express = require("express");
const router = express.Router();
const controlador = require("../controller/usuarioscontroller");
const autenticacion = require('../milddlewares/autenticacion');
const usuarioExiste = require('../milddlewares/usuarioExiste');

//Registro de usuario
router.post('/registro', controlador.registro);
//Validar registro
router.get('/validacion/:codigoRegistro', controlador.validarCodigo)

// Login de usuario
router.post("/login", controlador.login);

// Modificar perfil
router.put('/perfil/:id', autenticacion, usuarioExiste, controlador.modificarPerfil)

module.exports = router 
