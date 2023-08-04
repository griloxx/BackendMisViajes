const express = require("express");
const router = express.Router();
const controlador = require("../controller/entradascontroller");

// Ruta para listar los Registros general
router.get("/", controlador.listar);

// Ruta para ver Detalles de Registros Recomendados
router.get("/:id", controlador.detalles);

// Ruta de búsqueda por lugar y/o categoría
router.get("/consulta", controlador.consulta);


//Exportamos módulo
module.exports = router;
