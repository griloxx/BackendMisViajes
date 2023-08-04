const jwt = require('jsonwebtoken');

const generarError = require('../helpers/generarError');


async function autenticacion (req, res, next) {

    try {
        const { authorization } = req.headers;

        // Si no hay token lanzamos error
        if(!authorization) generarError('Error, no está logueado', 401 );

        // variable para verificar y almacenar el token la informacion del token 
        let tokenInfo;
        try {
            
            tokenInfo = jwt.verify(authorization, process.env.LLAVE_SECRETA);

        } catch (error) {
            generarError('Error, Acceso denegado', 401);
        }

        // Creamos propiedad user en el request para almacenar los datos del token del usuario
        // y tener acceso mas rápido

        req.user = tokenInfo;

        // Pasamos hacia el siguiente middleware o controlador
        next();
    } catch (error) {
        next(error)
    }
}

module.exports = autenticacion;