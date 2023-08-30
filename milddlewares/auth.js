const generarError = require('../helpers/generarError');

function auth (req, res, next ) {

    if (!req.user) {
        generarError('Error, no está logueado', 401 );
    } else {
        next()
    }
}


module.exports = auth