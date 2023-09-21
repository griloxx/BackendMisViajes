const joi = require("joi");

// Esquema joi validar registro de usuario
const esquemaRegistro = joi
  .object({
    name: joi.string().min(2).max(50).required().messages({
      "string.base": "Nombre debe ser de tipo texto",
      "string.min": "Nombre debe tener mínimo 2 caracteres",
      "string.max": "Nombre debe tener máximo 50 caracteres",
      "string.empty": "Nombre no puede estar vacío",
      "any.required": "Nombre es obligatorio",
    }),
    email: joi.string().email().min(5).max(80).required().messages({
      "string.base": "Email debe ser de tipo email",
      "string.min": "Email debe tener mínimo 5 caracteres",
      "string.max": "Email debe tener máximo 80 caracteres",
      "string.empty": "Email no puede estar vacío",
      "any.required": "Email es obligatorio",
    }),
    password: joi.string().min(6).max(100).required().messages({
      "string.base": "Password debe ser de tipo texto",
      "string.min": "Password debe tener mínimo 6 caracteres",
      "string.max": "Password debe tener máximo 100 caracteres",
      "any.required": "Password es obligatorio",
      "string.empty": "Password no puede estar vacío",
    }),
    avatar: joi.allow(""),
  })
  .options({ abortEarly: false });

const esquemaLogin = joi
  .object({
    email: joi.required().messages({
      "string.base": "Email debe ser de tipo email",
      "string.min": "Email debe tener mínimo 5 caracteres",
      "string.max": "Email debe tener máximo 80 caracteres",
      "string.empty": "Email no puede estar vacío",
      "any.required": "Email es obligatorio",
    }),
    password: joi.required().messages({
      "string.base": "Password debe ser de tipo texto",
      "string.min": "Password debe tener mínimo 6 caracteres",
      "string.max": "Password debe tener máximo 100 caracteres",
      "any.required": "Password es obligatorio",
      "string.empty": "Password no puede estar vacío",
    }),
  })
  .options({ abortEarly: false });

const esquemaEditarPerfil = joi
  .object({
    name: joi.string().min(2).max(50).messages({
      "string.base": "Nombre debe ser de tipo texto",
      "string.min": "Nombre debe tener mínimo 2 caracteres",
      "string.max": "Nombre debe tener máximo 50 caracteres",
      "string.empty": "Nombre no puede estar vacío",
    }),
    password: joi.string().min(6).max(100).messages({
      "string.base": "Password debe ser de tipo texto",
      "string.min": "Password debe tener mínimo 6 caracteres",
      "string.max": "Password debe tener máximo 20 caracteres",
    }),
    avatar: joi.allow(""),
  })
  .options({ abortEarly: false });

module.exports = { esquemaRegistro, esquemaLogin, esquemaEditarPerfil };
