const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const cors = require("cors");
const patch = require("path");

require("dotenv").config();
const { port } = process.env;

const getEntradas = require("./rutas/rutasentradas");
const getUsuarios = require("./rutas/rutasusuarios");

const rutaImagenesPerfil = patch.join(__dirname, "avatar")
const rutaImagenesPosts = patch.join(__dirname, "fotos")

//Middleware para ruta statica
app.use(express.static(rutaImagenesPerfil))
app.use(express.static(rutaImagenesPosts))
//Middleware para req.body
app.use(express.json());
// cors para poder llamarlo desde el frontend sin que ponga pegas
app.use(cors());
//Middleware para fileupload
app.use(fileUpload());
//Rutas de entradas
app.use("/entradas", getEntradas);
//Rutas de usuarios
app.use("/usuarios", getUsuarios);

// Pagina no encontrada
app.use((req, res, next) => {
  res.status(404);
  res.send("pagina no encontrada");
});

// Errores del sistema
app.use((err, req, res, next) => {
  // Si el error tiene el nombre "ValidationError", quiere decir que es un error tirado por Joi, así que le ponemos un statusCode 400
  if (err.name === "ValidationError") {
    err.status = 400;
  }
  res.status(err.status || 500);
  res.send({
    status: err.status,
    message: err.message,
  });
});

app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
