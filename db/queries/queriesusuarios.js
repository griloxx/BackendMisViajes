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

async function comprobarActivo(id) {

  let connection;
  try {
    connection = await getPool();
    // Comprobamos que el codigo de registro ya está borrado
    const verificar = await connection.query(
      "SELECT codigoRegistro FROM usuarios WHERE id = ?",
      [id]
    )

      return verificar;

  } finally {
    if(connection) connection.release();
    
  }
}

async function getUsuarioBy(objecto) {

  const [llave] = Object.keys(objecto);
  const valor = objecto[llave];

  let connection;
  try {

    connection = await getPool();
    const [usuario] = await connection.query(
      "SELECT * FROM usuarios WHERE ?? = ?",
      [llave, valor]
    );

    return usuario[0];

  } finally {
    if(connection) connection.release()
  }
}

async function editarPerfil(id, name, password = null, avatar = null) {

  let connection;
  try {
    connection = await getPool();

    if (password === null) {
      [passwordBd] = await connection.query(
        "SELECT password FROM usuarios WHERE id = ?",
        [id]
      );
      password = passwordBd[0].password;
    }

  
    await connection.query(
      "UPDATE usuarios SET name = ?, password = ?, avatar = ? WHERE id = ?",
      [name, password, avatar, id]
    );

  } finally {
    if(connection) connection.release();
  }


}

module.exports = { crearUsuario, actualizarCodigo, getUsuarioBy, comprobarActivo, editarPerfil };
