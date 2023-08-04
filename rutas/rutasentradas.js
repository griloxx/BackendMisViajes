const express = require("express");
const router = express.Router();
const controlador = require("../controller/entradascontroller");
const autenticacion = require("../milddlewares/autenticacion");
const usuarioExiste = require("../milddlewares/usuarioExiste");

// Ruta para listar los Registros general
router.get("/", controlador.listar);

// Ruta para ver Detalles de Registros Recomendados
router.get("/:id", controlador.detalles);

// Ruta de búsqueda por lugar y/o categoría
router.get("/consulta", controlador.consulta);
//Ruta para crear la recomendación
router.post("/crearentrada", autenticacion, usuarioExiste, controlador.crear);
//Ruta para los votos
router.post("/votar", autenticacion, usuarioExiste, controlador.votarEntrada);

//Exportamos módulo
module.exports = router;
