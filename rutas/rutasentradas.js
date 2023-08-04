const express = require("express");
const router = express.Router();
const controlador = require("../controller/entradascontroller");
const autenticacion = require("../milddlewares/autenticacion");
const usuarioExiste = require("../milddlewares/usuarioExiste");

// Ruta para listar los Registros general
router.get("/", controlador.listar);

// Ruta de búsqueda por lugar y/o categoría
router.get("/consulta", controlador.consulta);
//Ruta para crear la recomendación
router.post("/crearentrada", autenticacion, usuarioExiste, controlador.crear);

//Exportamos módulo
module.exports = router;
