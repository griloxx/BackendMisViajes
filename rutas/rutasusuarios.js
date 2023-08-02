const express = require("express");
const router = express.Router();
const controlador = require("../controller/usuarioscontroller");

//Registro de usuario
router.post('/registro', controlador.registro);
//Validar registro
router.get('/validacion/:codigoRegistro', controlador.validarCodigo)


module.exports = router