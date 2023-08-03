const crypto = require("node:crypto");
const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");
const { RUTA_FOTOS } = process.env;
const generarError = require("../helpers/generarError");

async function guardarFoto(
  foto,
  foto2 = null,
  foto3 = null,
  foto4 = null,
  foto5 = null
) {
  try {
    const rutaFoto = path.resolve(__dirname, "../", RUTA_FOTOS);

    //Crear ruta para las foto

    try {
      await fs.access(rutaFoto);
    } catch {
      await fs.mkdir(rutaFoto);
    }
    let fotos = [];

    //Ajustamos la foto
    const sharpImg = sharp(foto.data);
    sharpImg.resize(500);
    const nombreAletorio = crypto.randomUUID();
    const extension = path.extname(foto.name);
    const nombreFoto = `${nombreAletorio}${extension}`;
    const rutaCompleta = path.join(rutaFoto, nombreFoto);
    sharpImg.toFile(rutaCompleta);
    fotos.push(nombreFoto);

    if (foto2) {
      sharpImg2 = sharp(foto2.data);
      sharpImg2.resize(500);
      nombreAletorio2 = crypto.randomUUID();
      extension2 = path.extname(foto2);
      nombreFoto2 = `${nombreAletorio}${extension}`;
      rutaCompleta2 = path.join(rutaFoto, nombreFoto2);
      sharpImg2.toFile(rutaCompleta2);
      fotos.push(nombreFoto2);
    }
    if (foto3) {
      sharpImg3 = sharp(foto3.data);
      sharpImg3.resize(500);
      nombreAletorio3 = crypto.randomUUID();
      extension3 = path.extname(foto3);
      nombreFoto3 = `${nombreAletorio}${extension}`;
      rutaCompleta3 = path.join(rutaFoto, nombreFoto3);
      sharpImg3.toFile(rutaCompleta3);
      fotos.push(nombreFoto3);
    }
    if (foto4) {
      sharpImg4 = sharp(foto4.data);
      sharpImg4.resize(500);
      nombreAletorio4 = crypto.randomUUID();
      extension4 = path.extname(foto4);
      nombreFoto4 = `${nombreAletorio}${extension}`;
      rutaCompleta4 = path.join(rutaFoto, nombreFoto4);
      sharpImg4.toFile(rutaCompleta4);
      fotos.push(nombreFoto4);
    }

    if (foto5) {
      sharpImg5 = sharp(foto5.data);
      sharpImg5.resize(500);
      nombreAletorio5 = crypto.randomUUID();
      extension5 = path.extname(foto5);
      nombreFoto5 = `${nombreAletorio}${extension}`;
      rutaCompleta5 = path.join(rutaFoto, nombreFoto5);
      sharpImg5.toFile(rutaCompleta5);
      fotos.push(nombreFoto5);
    }

    return nombreFoto;
  } catch (error) {
    generarError("No se ha podido guardar la foto ");
  }
}

module.exports = guardarFoto;
