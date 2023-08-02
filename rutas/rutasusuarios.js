const express = require("express");
const router = express.Router();
const controlador = require("../controller/usuarioscontroller");

//Registro de usuario
router.post('/registro', controlador.registro);


module.exports = router