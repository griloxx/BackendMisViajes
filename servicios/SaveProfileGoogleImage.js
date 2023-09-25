const { default: axios } = require("axios");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("node:crypto");
const generarError = require("../helpers/generarError");
const { obtenerExtensionDesdeBuffer } = require("../helpers/obtenerExtensionDesdeBuffer");
const { RUTA_AVATAR } = process.env;


async function SaveProfileGoogleImage(url) {
   
    try {
        const rutaFoto = path.resolve(__dirname, "../", RUTA_AVATAR);
        try {
            await fs.access(rutaFoto);
          } catch {
            await fs.mkdir(rutaFoto);
          }
        // Realiza una solicitud GET a la URL de la imagen y especifica que la respuesta debe ser tratada como un flujo (stream).
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        
        const nombreAletorio = crypto.randomUUID();
        const extension = obtenerExtensionDesdeBuffer(response.data);
        const nombreFoto = `${nombreAletorio}${extension}`;
        // Define la ruta donde se guardará la imagen en el servidor.
        const rutaCompleta = path.join(rutaFoto, nombreFoto);
    

        await fs.writeFile(rutaCompleta, response.data);
    
        
        return nombreFoto

    } catch (error) {
        generarError(error); // Lanza cualquier error que ocurra durante la solicitud o escritura del archivo.
    }
  }

  module.exports = SaveProfileGoogleImage;