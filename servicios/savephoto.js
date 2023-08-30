const crypto = require("node:crypto");
const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");
const { RUTA_FOTOS } = process.env;
const generarError = require("../helpers/generarError");

async function guardarFoto(fotos) {
  
  try {
    const rutaFoto = path.resolve(__dirname, "../", RUTA_FOTOS);

    //Crear ruta para las foto

    try {
      await fs.access(rutaFoto);
    } catch {
      await fs.mkdir(rutaFoto);
    }
    let nombreFotos = []
    fotos.forEach((archivo) => {
      if(archivo !== undefined) {
        const sharpImg = sharp(archivo.data);
        sharpImg.resize(500);
        const nombreAletorio = crypto.randomUUID();
        const extension = path.extname(archivo.name);
        const nombreFoto = `${nombreAletorio}${extension}`;
        const rutaCompleta = path.join(rutaFoto, nombreFoto);
        sharpImg.toFile(rutaCompleta);
        nombreFotos.push(nombreFoto);
      }
    })
    return nombreFotos;
  } catch (error) {
    generarError("No se ha podido guardar la foto ");
  }
}

module.exports = guardarFoto;
