const { port } = process.env;

function validacionUsuario(name, codigoRegistro) {
  return `Bienvenido ${name},
    por favor, activa el usuario a través de http://localhost:${port}/usuarios/validacion/${codigoRegistro}`;
}

module.exports = { validacionUsuario };
