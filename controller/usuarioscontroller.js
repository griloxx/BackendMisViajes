const esquemaRegistro = require("../schemas/nuevousuario.js");



// Controlador de registro de usuarios
async function registro (req, res, next){
    
  
    try {
        await esquemaRegistro.validateAsync(req.body);
        const {name, email, password, avatar} = req.body
        res.json ({name, email, password, avatar})
    } catch (error) {
        next(error)
    }
}

module.exports = {registro}
