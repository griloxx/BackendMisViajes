const getPool = require("../pool");

async function getAll() {
  let connection;

  try {
    connection = await getPool();

    const [entradas] = await connection.query(
      "SELECT * FROM entradas ORDER BY entradilla DESC LIMIT 3"
    );

    return entradas;
  } finally{
    if (connection){
      connection.release();
    }
  }
}

async function getConsulta(lugar, categoria) {
  let connection;

  try {
    connection = await getPool();
    
    const [consulta1] = await connection.query(
      "SELECT * FROM entradas WHERE lugar like ? AND categoria = ? ORDER BY entradilla DESC LIMIT 3",
      [`%${lugar}%`, categoria]
    )
    
    const [consulta2] = await connection.query(
      "SELECT * FROM entradas WHERE lugar like ? OR categoria = ? ORDER BY entradilla DESC LIMIT 3",
      [`%${lugar}%`, categoria]
    )
    
      if(consulta1.length > 0) {
        return consulta1
      } else if (consulta2.length > 0){
        return consulta2
      } else{
        return consulta3 = "No se han encontrado coincidencias"
      }

  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = {
  getAll, getConsulta
};
