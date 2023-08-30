const express = require("express");
const router = express.Router();
const controlador = require("../controller/entradascontroller");
const autenticacion = require("../milddlewares/autenticacion");
const usuarioExiste = require("../milddlewares/usuarioExiste");
const auth = require("../milddlewares/auth");

// Ruta para listar los Registros general
router.get("/", autenticacion, controlador.listar);

// Ruta de búsqueda por lugar y/o categoría
router.get("/consulta", autenticacion, controlador.consulta);
// Ruta para ver Detalles de Registros Recomendados
router.get("/consulta/:id", autenticacion, controlador.detalles);

//Ruta para crear la recomendación
router.post("/crearentrada", autenticacion, usuarioExiste, auth, controlador.crear);
//Ruta para los votos
router.put("/votar/:id", autenticacion, usuarioExiste, auth, controlador.votarEntrada);
//Ruta para que usuario pueda borrar su recomendación
router.delete("/borrar/:id", autenticacion, usuarioExiste, auth, controlador.borrarEntrada)

//Ruta para comentar las entradas
router.post("/comentar/:entrada_id", autenticacion, usuarioExiste, auth, controlador.comentarEntrada);

//Exportamos módulo
module.exports = router;
