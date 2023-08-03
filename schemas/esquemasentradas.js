const joi = require("joi");

const esquemasEntradas = joi.object({
  titulo: joi.string().min(5).max(50).required(),
  categoria: joi.string().min(2).max(50).required(),
  lugar: joi.string().min(2).max(100).required(),
  texto: joi.string().min(25).max(65000).required(),
  user_id: joi.number().required(),
});

module.exports = esquemasEntradas;
