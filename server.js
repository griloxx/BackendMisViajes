const express = require("express");
const app = express();

require("dotenv").config();
const { port } = process.env;


const getEntradas = require("./rutas/rutasentradas");



app.use("/entradas", getEntradas);


app.use((req, res, next) => {
  res.status(404);
  res.send("pagina no encontrada");
});


app.use((err, req, res, next) => {
  console.log(err);
  // Si el error tiene el nombre "ValidationError", quiere decir que es un error tirado por Joi, así que le ponemos un statusCode 400
  if (error.name === "ValidationError") {
    error.statusCode = 400;
  }


  res.status(err.statusCode || 500);
  res.send({
    status: "error",
    message: err.message,
  });
});


app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
