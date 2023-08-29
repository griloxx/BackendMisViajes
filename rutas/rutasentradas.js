const express = require("express");
const router = express.Router();
const controlador = require("../controller/entradascontroller");
const autenticacion = require("../milddlewares/autenticacion");
const usuarioExiste = require("../milddlewares/usuarioExiste");

// Ruta para listar los Registros general
router.get("/", controlador.listar);

// Ruta de búsqueda por lugar y/o categoría
router.get("/consulta", controlador.consulta);
// Ruta para ver Detalles de Registros Recomendados
router.get("/consulta/:id", controlador.detalles);

//Ruta para crear la recomendación
router.post("/crearentrada", autenticacion, usuarioExiste, controlador.crear);
//Ruta para los votos
router.put("/votar/:id", autenticacion, usuarioExiste, controlador.votarEntrada);
//Ruta para que usuario pueda borrar su recomendación
router.delete("/borrar/:id", autenticacion, usuarioExiste, controlador.borrarEntrada)

//Ruta para comentar las entradas
router.post("/comentar/:entrada_id", autenticacion, usuarioExiste, controlador.comentarEntrada);

//Exportamos módulo
module.exports = router;
