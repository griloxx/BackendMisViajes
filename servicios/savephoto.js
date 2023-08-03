const crypto = require("node:crypto");
const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");
const { RUTAS_FOTOS } = process.env;
const generarError = require("../helpers/generarError");

async function guardarFoto(
  foto,
  foto2 = null,
  foto3 = null,
  foto4 = null,
  foto5 = null
) {
  try {
    const rutaFoto = path.resolve(__dirname, "/foto");
    console.log("aqui");
    //Crear ruta para las foto

    try {
      await fs.access(rutaFoto);
    } catch {
      await fs.mkdir(rutaFoto);
    }
    //Ajustamos la foto
    const sharpImg = sharp(foto.data);
    sharpImg.resize(500);
    const nombreAletorio = crypto.randomUUID();
    const extension = path.extname(foto);
    const nombreFoto = `${nombreAletorio}.${extension}`;
    const rutaCompleta = path.join(rutaFoto, nombreFoto);
    sharpImg.toFile(rutaCompleta);

    if (foto2) {
      sharpImg2 = sharp(foto2.data);
      sharpImg2.resize(500);
      nombreAletorio2 = crypto.randomUUID();
      extension2 = path.extname(foto2);
      nombreFoto2 = `${nombreAletorio}.${extension}`;
      rutaCompleta2 = path.join(rutaFoto, nombreFoto2);
      sharpImg2.toFile(rutaCompleta2);
    }
    if (foto3) {
      sharpImg3 = sharp(foto3.data);
      sharpImg3.resize(500);
      nombreAletorio3 = crypto.randomUUID();
      extension3 = path.extname(foto3);
      nombreFoto3 = `${nombreAletorio}.${extension}`;
      rutaCompleta3 = path.join(rutaFoto, nombreFoto3);
      sharpImg3.toFile(rutaCompleta3);
    }
    if (foto4) {
      sharpImg4 = sharp(foto4.data);
      sharpImg4.resize(500);
      nombreAletorio4 = crypto.randomUUID();
      extension4 = path.extname(foto4);
      nombreFoto4 = `${nombreAletorio}.${extension}`;
      rutaCompleta4 = path.join(rutaFoto, nombreFoto4);
      sharpImg4.toFile(rutaCompleta4);
    }

    if (foto5) {
      sharpImg5 = sharp(foto5.data);
      sharpImg5.resize(500);
      nombreAletorio5 = crypto.randomUUID();
      extension5 = path.extname(foto5);
      nombreFoto5 = `${nombreAletorio}.${extension}`;
      rutaCompleta5 = path.join(rutaFoto, nombreFoto5);
      sharpImg5.toFile(rutaCompleta5);
    }
    return { nombreFoto, nombreFoto2, nombreFoto3, nombreFoto4, nombreFoto5 };
  } catch (error) {
    generarError("No se ha podido guardar la foto ");
  }
}

module.exports = guardarFoto;
