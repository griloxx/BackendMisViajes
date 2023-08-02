const generarError = require("../../helpers/generarError");
const getPool = require("../pool");

async function crearUsuario({ name, email, passwordHash, codigoRegistro, avatar = null }) {
  let connection;
  try {
    connection = await getPool();
    const [usuarios] = await connection.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );
    if (usuarios.length > 0) {
      generarError("el usuario ya existe", 500);
    }
    const [usuario] = await connection.query(
      "INSERT INTO usuarios (name, email, password, codigoRegistro, avatar) VALUES(?,?,?,?,?)",
      [name, email, passwordHash, codigoRegistro, avatar]
    );
    return usuario.insertId;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function actualizarCodigo(codigoRegistro) {
  let connection;
  try {

    connection = await getPool();

    // Buscamos a un usuario con ese codigo
    const [users] = await connection.query(
      "SELECT id FROM usuarios WHERE codigoRegistro = ?",
      [codigoRegistro]
    );
    if(users.length < 1) generarError('No existe ningún usuario con este código.', 400);

    const [user] = users

    // Actualizamos el usuario
    await connection.query(
      "UPDATE usuarios SET codigoRegistro = null WHERE id = ?",
      [user.id]
    )

  } finally {
    if(connection) connection.release()
  }
}

module.exports = { crearUsuario, actualizarCodigo };
