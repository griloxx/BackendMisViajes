const { getAll, getConsulta } = require("../db/queries/queriesentradas");
const generarError = require("../helpers/generarError");

async function listar(req, res, next) {
  let entradas;
  try {
    if(!req.body.votos){
      entradas = await getAll();
    } else {
      const {votos} = req.body;
      entradas = await getAll(votos);
    }
      res.json(entradas);
  } catch (error) {
    next(error)
  }
  
}

async function consulta(req, res, next) {
  let consulta;
  try {
    if(!req.body.votos) {
      const {lugar, categoria} = req.body
      consulta = await getConsulta(lugar, categoria);
      
    } else {
      const {lugar, categoria, votos} = req.body
      consulta = await getConsulta(lugar, categoria, votos);
    }
    res.json(consulta);
  } catch (error) {
    next (error)
  }
  
}


module.exports = { listar, consulta };
