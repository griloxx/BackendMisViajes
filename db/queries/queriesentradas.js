const getPool = require("../pool");

// Coger todos las entradas ordenado por votos o fecha(Entradilla)
async function getAll(votos = "entradilla") {
  let connection;

  try {
    connection = await getPool();

    const [entradas] = await connection.query(
      "SELECT * FROM entradas ORDER BY ?? DESC LIMIT 3",
      [votos]
    );

    return entradas;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Ver detalles entrada recomendada

async function getId(id) {
  let connection;

  try {
    connection = await getPool();

    const [entradas] = await connection.query(
      "SELECT * FROM entradas WHERE id = ?",
      [id]
    );

    return entradas;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Filtrar por lugar o categoría ordenado por votos o fecha(Entradilla)
async function getConsulta(lugar, categoria, votos = "entradilla") {
  let connection;

  try {
    connection = await getPool();

    const [consulta1] = await connection.query(
      "SELECT * FROM entradas WHERE lugar like ? AND categoria = ? ORDER BY ?? DESC LIMIT 3",
      [`%${lugar}%`, categoria, votos]
    );

    const [consulta2] = await connection.query(
      "SELECT * FROM entradas WHERE lugar like ? OR categoria = ? ORDER BY ?? DESC LIMIT 3",
      [`%${lugar}%`, categoria, votos]
    );

    if (consulta1.length > 0) {
      return consulta1;
    } else if (consulta2.length > 0) {
      return consulta2;
    } else {
      return (consulta3 = "No se han encontrado coincidencias");
    }
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Creación de una entrada nueva por un usuario registrado
async function entradaNueva(
  titulo,
  categoria,
  lugar,
  texto,
  user_id,
  savePhoto
) {
  let connection;

  try {
    connection = await getPool();

    const [insertarEntrada] = await connection.query(
      "INSERT INTO entradas (titulo, categoria, lugar, texto, user_id, foto) VALUES(?,?,?,?,?,?)",
      [titulo, categoria, lugar, texto, user_id, savePhoto[0]]
    );

    for (i = 1; i <= savePhoto.length; i++) {
      if (i !== 1) {
        await connection.query(
          "UPDATE entradas SET foto" + i + " = ? WHERE id = ?",
          [savePhoto[--i], insertarEntrada.insertId]
        );
        i++;
      }
    }
    return insertarEntrada.insertId;
  } finally {
    if (connection) connection.release();
  }
}

// Votar una recomendación por un usuario registrado

async function votar(id) {
  let connection;
  try {
    connection = await getPool();
    let [votos] = await connection.query(
      "SELECT votos FROM entradas WHERE id = ?",
      [id]
    );

    valorVotos = votos[0].votos + 1;

    await connection.query("UPDATE entradas SET votos = ? WHERE id = ?", [
      valorVotos,
      id,
    ]);

    return valorVotos;
  } finally {
    if (connection) connection.release();
  }
}

// Borrar una entrada por un usuario registrado
async function deleteEntrada(id) {
  let connection;

  try {
    connection = await getPool();

    const [borrarEntrada] = await connection.query(
      "DELETE FROM entradas WHERE id = ?",
      [id]
    );
    
    return borrarEntrada;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}


async function comentarRecomendacion(comentario, entrada_id, user_id, imagen) {

  let connection;
  try {
    const [foto] = imagen;
    connection = await getPool();

    const insertar = await connection.query(
      "INSERT INTO comentarios (comentario, entrada_id, user_id, foto) VALUES(?,?,?,?)",
      [comentario, entrada_id, user_id, foto]
    )

      return insertar.insertId;
  } finally {
    if(connection) connection.release();
  }
}

// Exportamos las funciones
module.exports = {
  getAll,
  getConsulta,
  entradaNueva,
  votar,
  getId,
  deleteEntrada,
  comentarRecomendacion
};