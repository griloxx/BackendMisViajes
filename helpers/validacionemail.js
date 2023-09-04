const { port_frontend} = process.env;

function validacionUsuario(name, codigoRegistro) {
  return `Bienvenido ${name},
    por favor, activa el usuario a través de http://localhost:${port_frontend}/validar-registro/${codigoRegistro}`;
}

module.exports = { validacionUsuario };
