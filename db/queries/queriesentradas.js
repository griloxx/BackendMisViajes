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
  }
}

module.exports = {
  getAll,
};
