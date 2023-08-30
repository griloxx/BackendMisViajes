const jwt = require('jsonwebtoken');


async function autenticacion (req, res, next) {

    try {
        const { authorization } = req.headers;

        // variable para verificar y almacenar el token la informacion del token 
        let tokenInfo;
        if(authorization) {
            
            tokenInfo = jwt.verify(authorization, process.env.LLAVE_SECRETA);

            if(tokenInfo) {    
                req.user = tokenInfo;
            } else {
                req.user = null;
            }

        } else {
            req.user = null;
        }

        
        next();
    } catch (error) {
        next(error)
    }
}

module.exports = autenticacion;
