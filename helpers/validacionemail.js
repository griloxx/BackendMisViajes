const { port_frontend} = process.env;

function validacionUsuario(name, codigoRegistro) {
  return `Bienvenido ${name},
  por favor, activa el usuario a través de https://mis-viajes.vercel.app/validar-registro/${codigoRegistro}`;
}

module.exports = { validacionUsuario };
