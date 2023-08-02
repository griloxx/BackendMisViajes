// Función encargada de lanzar los errores personalizados
function generarError(msg, status) {
  const error = new Error(msg);
  error.status = status;
  throw error;
}
module.exports = generarError;
