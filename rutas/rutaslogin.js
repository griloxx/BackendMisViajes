const express = require("express");
const router = express.Router();
const controlador = require("../controller/logincontroller");

// Login de usuario
router.get("/usuarios/login", controlador.login);


//Exportamos módulo
module.export = router;

