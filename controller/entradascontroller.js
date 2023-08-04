const { getAll, getConsulta } = require("../db/queries/queriesentradas");
// const generarError = require("../helpers/generarError");

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

async function detalles(res, next) {
  let entradas;
  try {
    entradas = await getAll();
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

// Esportamos las funciones creadas
module.exports = { listar, consulta, detalles};
