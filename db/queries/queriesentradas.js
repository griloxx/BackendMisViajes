const generarError = require("../../helpers/generarError");
const getPool = require("../pool");

// Coger todos las entradas ordenado por votos o fecha(Entradilla)
async function getAll(votos = "entradilla") {
  let connection;
  let entradas;
  try {
    connection = await getPool();
    if (votos == "votos") {
      [entradas] = await connection.query(
        "SELECT e.*, COUNT(v.id) AS total_votos FROM entradas e LEFT JOIN votos v ON e.id = v.entrada_id GROUP BY e.id ORDER BY total_votos DESC LIMIT 3"
      );
    } else {
      [entradas] = await connection.query(
        "SELECT * FROM entradas ORDER BY ?? DESC LIMIT 3",
        [votos]
      );
    }

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
      "SELECT e.*, COUNT(v.id) AS total_votos FROM entradas e LEFT JOIN votos v ON e.id = v.entrada_id WHERE e.id = ? GROUP BY e.id",
      [id]
    );

    return entradas[0];
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
async function getCommentsId(id) {
  let connection;

  try {
    connection = await getPool();

    const [entradas] = await connection.query(
      "SELECT c.* FROM comentarios c LEFT JOIN entradas e ON c.entrada_id = e.id WHERE c.entrada_id = ? GROUP BY c.id",
      [id]
    );
    return entradas;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
async function getFotosId(id) {
  let connection;

  try {
    connection = await getPool();

    const [entradas] = await connection.query(
      "SELECT f.* FROM fotosentradas f LEFT JOIN entradas e ON f.entrada_id = e.id WHERE f.entrada_id = ? GROUP BY f.id",
      [id]
    );
    return entradas;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
async function getVotosId(id) {
  let connection;

  try {
    connection = await getPool();

    const [entradas] = await connection.query(
      "SELECT COUNT(v.id) AS total_votos FROM votos v LEFT JOIN entradas e ON v.entrada_id = e.id WHERE v.entrada_id = ? GROUP BY v.id",
      [id]
    );
    if (entradas.id) {
      return entradas[0].total_votos;
    }
    return;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Filtrar por lugar o categoría ordenado por votos o fecha(Entradilla)
async function getConsulta(lugar, categoria) {
  let connection;

  try {
    connection = await getPool();

    const [consulta1] = await connection.query(
      "SELECT * FROM entradas WHERE lugar like ? AND categoria = ? ORDER BY 'entradilla' DESC LIMIT 3",
      [`%${lugar}%`, categoria]
    );

    const [consulta2] = await connection.query(
      "SELECT * FROM entradas WHERE lugar like ? OR categoria = ? ORDER BY 'entradilla' DESC LIMIT 3",
      [`%${lugar}%`, categoria]
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
async function getConsultaVotos(lugar, categoria) {
  let connection;

  try {
    connection = await getPool();

    const [consulta1] = await connection.query(
      `
      SELECT e.*, COUNT(v.id) AS total_votos
      FROM entradas e
      LEFT JOIN votos v ON e.id = v.entrada_id
      WHERE e.lugar LIKE ? AND e.categoria = ?
      GROUP BY e.id
      ORDER BY total_votos DESC
      LIMIT 3;
    `,
      [`%${lugar}%`, categoria]
    );

    const [consulta2] = await connection.query(
      `
      SELECT e.*, COUNT(v.id) AS total_votos
      FROM entradas e
      LEFT JOIN votos v ON e.id = v.entrada_id
      WHERE e.lugar LIKE ? OR e.categoria = ?
      GROUP BY e.id
      ORDER BY total_votos DESC
      LIMIT 3;
    `,
      [`%${lugar}%`, categoria]
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
      "INSERT INTO entradas (titulo, categoria, lugar, texto, user_id) VALUES(?,?,?,?,?)",
      [titulo, categoria, lugar, texto, user_id]
    );

    savePhoto.forEach(async (foto) => {
      await connection.query(
        "INSERT INTO fotosEntradas (entrada_id, foto) VALUES(?,?)",
        [insertarEntrada.insertId, foto]
      );
    });

    return insertarEntrada.insertId;
  } finally {
    if (connection) connection.release();
  }
}

// Comprobar que ya a votado

async function yaVotado(entradaId, id) {
  let connection;
  try {
    connection = await getPool();
    const [votos] = await connection.query(
      "SELECT * FROM votos WHERE entrada_id = ? AND user_id = ?",
      [entradaId, id]
    );

    return votos[0];
  } finally {
    if (connection) connection.release();
  }
}
// Votar una recomendación por un usuario registrado

async function votar(entradaId, id) {
  let connection;
  try {
    connection = await getPool();
    const [votos] = await connection.query(
      "INSERT INTO votos (entrada_id, user_id) VALUES(?,?)",
      [entradaId, id]
    );

    return votos.insertId;
  } finally {
    if (connection) connection.release();
  }
}
async function quitarVotos(entradaId, id) {
  let connection;
  try {
    connection = await getPool();
    const [votos] = await connection.query(
      "DELETE FROM votos WHERE entrada_id = ? AND user_id = ?",
      [entradaId, id]
    );

    return votos.insertId;
  } finally {
    if (connection) connection.release();
  }
}

// Borrar una entrada por un usuario registrado
async function deleteEntrada(id, creator_id) {
  let connection;

  try {
    connection = await getPool();
    const [consulaEntrada] = await connection.query(
      "SELECT * FROM entradas WHERE id = ?",
      [id]
    );
    if (consulaEntrada[0].user_id === creator_id) {
      const [borrarEntrada] = await connection.query(
        "DELETE FROM entradas WHERE id = ?",
        [id]
      );
      return borrarEntrada;
    }
    generarError("Usted no tiene derecho a borrar la entrada");
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function comentarRecomendacion(comentario, entrada_id, user_id, imagen) {
  let connection;
  try {
    connection = await getPool();

    const insertar = await connection.query(
      "INSERT INTO comentarios (comentario, entrada_id, user_id, foto) VALUES(?,?,?,?)",
      [comentario, entrada_id, user_id, imagen]
    );

    return insertar.insertId;
  } finally {
    if (connection) connection.release();
  }
}

// Exportamos las funciones
module.exports = {
  getAll,
  getConsulta,
  getConsultaVotos,
  entradaNueva,
  yaVotado,
  votar,
  quitarVotos,
  getId,
  getCommentsId,
  getFotosId,
  getVotosId,
  deleteEntrada,
  comentarRecomendacion,
};
