const joi = require("joi");

const esquemasEntradas = joi.object({
  titulo: joi.string().min(6).max(150).required().messages({
    "string.base": "Título debe ser de tipo texto",
    "string.min": "Título debe tener mínimo 6 caracteres",
    "string.max": "Título debe tener máximo 150 caracteres",
    "any.required": "Título es obligatorio",
    "string.empty": "Título no puede estar vacío",
  }),
  categoria: joi.string().min(2).max(50).required().messages({
    "string.base": "Categoría debe ser de tipo texto",
    "string.min": "Categoría debe tener mínimo 2 caracteres",
    "string.max": "Categoría debe tener máximo 50 caracteres",
    "any.required": "Categoría es obligatorio",
    "string.empty": "Categoría no puede estar vacío",
  }),
  lugar: joi.string().min(2).max(150).required().messages({
    "string.base": "Lugar debe ser de tipo texto",
    "string.min": "Lugar debe tener mínimo 2 caracteres",
    "string.max": "Lugar debe tener máximo 150 caracteres",
    "any.required": "Lugar es obligatorio",
    "string.empty": "Lugar no puede estar vacío",
  }),
  texto: joi.string().min(15).max(65000).required().messages({
    "string.base": "Descripción debe ser de tipo texto",
    "string.min": "Descripción debe tener mínimo 15 caracteres",
    "string.max": "Descripción debe tener máximo 65000 caracteres",
    "any.required": "Descripción es obligatorio",
    "string.empty": "Descripción no puede estar vacío",
  }),
});

module.exports = esquemasEntradas;
