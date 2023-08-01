const { getAll } = require("../db/queries/queriesentradas");

async function listar(req, res) {
  const entradas = await getAll();

  res.json(entradas);
}

module.exports = { listar };
