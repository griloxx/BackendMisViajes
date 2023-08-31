const {getUsuarioBy} = require('../db/queries/queriesusuarios');

const generarError = require('../helpers/generarError');

async function usuarioExiste(req, res, next) {
    // Cogemos id de req.user que le pasó el middleware de autenticacion
    
    try {
        if(req.user?.id) {
            const { id } = req.user;
            
            const usuario = await getUsuarioBy({id});

            // Comprobamos que existe el usuario y si existe traemos los datos actualizados para guardarlos nuevamente en req.user
    
            if(!usuario) generarError('Error, el usuario con el que intenta acceder no existe', 401);
    
            // Datos actualizados de usuario a mano en req.user
            req.user = {
                id: usuario.id,
                avatar: usuario.avatar
            };
        }
        
        next();
        
    } catch (error) {
        next(error)
    }
}

module.exports = usuarioExiste;