const express = require("express");
const router = express.Router();
const controlador = require("../controller/entradascontroller");

//Rutas de entradas y consulta de entradas
router.get("/", controlador.listar);

router.get("/consulta", controlador.consulta);

router.get("/consultavotos", controlador.consulta);

//Exportamos módulo
module.exports = router;
