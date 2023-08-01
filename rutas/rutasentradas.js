const express = require("express");
const router = express.Router();
const controlador = require("../controller/entradascontroller");

router.get("/", controlador.listar);

module.exports = router;
