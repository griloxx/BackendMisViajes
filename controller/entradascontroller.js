const { getAll, getConsulta } = require("../db/queries/queriesentradas");

async function listar(req, res) {
  const entradas = await getAll();

  res.json(entradas);
}

async function consulta(req, res) {
  const {lugar, categoria } = req.body
  const consulta = await getConsulta(lugar, categoria);
  res.json(consulta);
}

module.exports = { listar, consulta };
