const {
  getAll,
  getConsulta,
  entradaNueva,
} = require("../db/queries/queriesentradas");
const generarError = require("../helpers/generarError");
// const generarError = require("../helpers/generarError");
const esquemasEntradas = require("../schemas/esquemasentradas");
const guardarFoto = require("../servicios/savephoto");

// Función asincrona para listar de todas las entradas
async function listar(req, res, next) {
  let entradas;
  try {
    if (!req.body.votos) {
      entradas = await getAll();
    } else {
      const { votos } = req.body;
      entradas = await getAll(votos);
    }
    res.json(entradas);
  } catch (error) {
    next(error);
  }
}

// Función asincrona para realizar consultas de lugar y/o categoria
async function consulta(req, res, next) {
  let consulta;
  try {
    if (!req.body.votos) {
      const { lugar, categoria } = req.body;
      consulta = await getConsulta(lugar, categoria);
    } else {
      const { lugar, categoria, votos } = req.body;
      consulta = await getConsulta(lugar, categoria, votos);
    }
    res.json(consulta);
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    await esquemasEntradas.validateAsync(req.body);
    const { titulo, categoria, lugar, texto, user_id } = req.body;
    const { foto, foto2, foto3, foto4, foto5 } = req.files;
    if (!foto) {
      generarError("Al menos una foto es obligatoria", 400);
    }
    //Guardar fotos en la carpeta fotos

    const savePhoto = await guardarFoto([foto, foto2, foto3, foto4, foto5]);

    //Guardar entrada en la BD

    await entradaNueva(titulo, categoria, lugar, texto, user_id, savePhoto);

    res.send("Entrada guardada con éxito");
  } catch (error) {
    next(error);
  }
}
// Esportamos las funciones creadas
module.exports = { listar, consulta, crear };
