const getPool = require("../pool");

async function getAll() {
  let connection;

  try {
    connection = await getPool();

    const [entradas] = await connection.query(
      "SELECT * FROM entradas ORDER BY entradilla DESC LIMIT 3"
    );

    return entradas;
  } catch (error) {
    console.log(error);
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
    const [consulta] = await connection.query(
      "SELECT * FROM entradas WHERE lugar = ? OR categoria = ?",
      [lugar, categoria]
    )
    return consulta
  } catch (error){
    console.log (error)
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = {
  getAll, getConsulta
};
