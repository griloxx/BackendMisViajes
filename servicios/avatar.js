const crypto = require("node:crypto");
const fs = require("fs/promises");
const path = require("path");
const sharp = require("sharp");
const { RUTA_AVATAR } = process.env;
const generarError = require("../helpers/generarError");

async function guardarAvatar(avatar) {
  try {
    const rutaAvatar = path.resolve(__dirname, "../", RUTA_AVATAR);

    //Crear ruta para el avatar
    try {
      await fs.access(rutaAvatar);
    } catch {
      await fs.mkdir(rutaAvatar);
    }

    const nombreAvatar = async (archivo) => {
      const sharpImg = sharp(archivo.data);
      sharpImg.resize(100);
      const nombreAletorio = crypto.randomUUID();
      const extension = path.extname(archivo.name);
      const nombreFoto = `${nombreAletorio}${extension}`;
      const rutaCompleta = path.join(rutaAvatar, nombreFoto);
      await sharpImg.toFile(rutaCompleta);
      return nombreFoto;
    };

    const nombre = nombreAvatar(avatar);
    return nombre;
  } catch (error) {
    generarError("No se ha podido guardar el avatar");
  }
}

module.exports = guardarAvatar;
