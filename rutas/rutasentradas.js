const express = require("express");
const router = express.Router();
const controlador = require("../controller/entradascontroller");

router.get("/", controlador.listar);

router.get("/consulta", controlador.consulta);

router.get("/consultavotos", controlador.consulta);

module.exports = router;
