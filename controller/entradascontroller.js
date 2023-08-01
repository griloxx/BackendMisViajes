const { getAll, getConsulta } = require("../db/queries/queriesentradas");
const generarError = require("../helpers/generarError");

async function listar(req, res, next) {
  try {
    const entradas = await getAll();

    res.json(entradas);
  } catch (error) {
    next(error)
  }
  
}

async function consulta(req, res, next) {
  try {
    const {lugar, categoria } = req.body
    const consulta = await getConsulta(lugar, categoria);
    res.json(consulta);
  } catch (error) {
    next (error)
  }
  
}

module.exports = { listar, consulta };
