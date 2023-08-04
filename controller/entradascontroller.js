const { func } = require("joi");
const {
  getAll,
  getConsulta,
  entradaNueva,
  votar,
  getId,
} = require("../db/queries/queriesentradas");
const generarError = require("../helpers/generarError");
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

// Función asíncrona para ver detalles de una entrada recomendada

async function detalles(req, res, next) {
  const {id} = req.params
  let entradas;
  try {
    entradas = await getId(id);
    if (entradas < 1) generarError ("La entrada no existe", 400)
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

    const insertarEntrada = await entradaNueva(
      titulo,
      categoria,
      lugar,
      texto,
      user_id,
      savePhoto
    );

    res.json({
      status: "ok",
      message: "Entrada insertada con éxito",
      data: insertarEntrada,
    });
  } catch (error) {
    next(error);
  }
}

async function votarEntrada(req, res, next) {
  try {
    const { id } = req.body;

    const votos = await votar(id);

    res.json({
      status: "ok",
      message: "voto sumado con éxito",
      data: votos,
    });
  } catch (error) {
    next(error);
  }
}
// Esportamos las funciones creadas
module.exports = { detalles, listar, consulta, crear, votarEntrada };
