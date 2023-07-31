const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("prueba completada");
});

app.listen(3000, () => {
  `Servidor iniciado en el puerto 3000`;
});
