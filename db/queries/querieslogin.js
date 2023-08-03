const generarError = require("../../helpers/generarError");
const getPool = require("../pool");

const login = async (email) = {
    let connection;

    try {
        connection = await getPool();
        const[result] = await connection.query (
            "SELECT * FROM usuarios WHERE email = ?",
            [email]
        )

        if (result.lenght === 0) {
            throw generarError ("No hay ningún usuario con ese email o contraseña", 404)
        };

        return result[0];

    } finally {
        if (connection) connection.release();
    }

    module.export = login

        
    
}
