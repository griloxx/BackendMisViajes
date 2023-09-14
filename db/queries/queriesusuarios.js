const { func } = require("joi");
const generarError = require("../../helpers/generarError");
const getPool = require("../pool");

async function crearUsuario({
  name,
  email,
  passwordHash,
  codigoRegistro,
  nombreAvatar = null,
}) {
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
      [name, email, passwordHash, codigoRegistro, nombreAvatar]
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
    if (users.length < 1)
      generarError("No existe ningún usuario con este código.", 400);

    const [user] = users;

    // Actualizamos el usuario
    await connection.query(
      "UPDATE usuarios SET codigoRegistro = null WHERE id = ?",
      [user.id]
    );
  } finally {
    if (connection) connection.release();
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
    );

    return verificar;
  } finally {
    if (connection) connection.release();
  }
}

async function getUsuarioBy(objecto) {
  const [llave] = Object.keys(objecto);
  const valor = objecto[llave];

  let connection;
  try {
    connection = await getPool();
    const [usuario] = await connection.query(
      "SELECT id, name, email, create_date, avatar FROM usuarios WHERE ?? = ?",
      [llave, valor]
    );
    return usuario[0];
  } finally {
    if (connection) connection.release();
  }
}
async function getEntradaByUserId({id}) {

  let connection;
  try {
    connection = await getPool();
    const [usuario] = await connection.query(
      "SELECT * FROM entradas WHERE user_id = ?",
      [id]
    );
      
    return usuario;
  } finally {
    if (connection) connection.release();
  }
}

async function editarPerfil(id, name = null, password = null, avatar = null) {
  let connection;
  let passwordBd;
  let nameBd;
  let avatarBd;
  try {
    connection = await getPool();

    if (!name) {
      [nameBd] = await connection.query(
        "SELECT name FROM usuarios WHERE id = ?",
        [id]
      );
      name = nameBd[0].name;
    }

    if (!avatar) {
      [avatarBd] = await connection.query(
        "SELECT avatar FROM usuarios WHERE id = ?",
        [id]
      );
      avatar = avatarBd[0].avatar;
    }

    if (!password) {
      [passwordBd] = await connection.query(
        "SELECT password FROM usuarios WHERE id = ?",
        [id]
      );
      password = passwordBd[0].password;
    }
    if(avatar === "sinAvatar") {
      avatar = null;
    }
    await connection.query(
      "UPDATE usuarios SET name = ?, password = ?, avatar = ? WHERE id = ?",
      [name, password, avatar, id]
    );

    return { id, name, avatar };
  } finally {
    if (connection) connection.release();
  }
}

async function avatarEliminado(id) {
  let connection;
  try {
    connection = await getPool();
    const [sinAvatar] = await connection.query(
      "UPDATE usuarios SET avatar = null WHERE id = ? ",
      [id]
    );
    return sinAvatar;
  } finally {
    if (connection) connection.release();
  }
}

module.exports = {
  crearUsuario,
  actualizarCodigo,
  getUsuarioBy,
  getEntradaByUserId,
  comprobarActivo,
  editarPerfil,
  avatarEliminado,
};
