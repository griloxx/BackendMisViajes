const path = require("path");
const {
  getAll,
  getConsulta,
  entradaNueva,
  votar,
  getId,
  deleteEntrada,
  comentarRecomendacion,
  yaVotado,
  quitarVotos,
  getCommentsId,
  getFotosId,
  getVotosId,
} = require("../db/queries/queriesentradas");
const generarError = require("../helpers/generarError");
const esquemasEntradas = require("../schemas/esquemasentradas");
const guardarFoto = require("../servicios/savephoto");
const fs = require("fs/promises");

// Función asincrona para listar de todas las entradas
async function listar(req, res, next) {
  let entradas;
  try {
    const { votos } = req.query;
    entradas = await getAll(votos);
    if (!entradas) {
      res.json({
        status: "ok",
        message: "No se a encontado ninguna entrada",
      });
    }
    entradas = await Promise.all(entradas.map(async (entrada) => {
      entrada.fotos = await getFotosId(entrada.id);
      return entrada
    }))

    if (req.user?.id) {
      const userId = req.user.id;
      entradas = await Promise.all(entradas.map(async (entrada) => {
        entrada.yaVotado = await yaVotado(entrada.id, userId);
        return entrada
      }))
    }
    
    res.json({
      status: "ok",
      data: entradas
    });
  } catch (error) {
    next(error);
  }
}

// Función asíncrona para ver detalles de una entrada recomendada

async function detalles(req, res, next) {
  const { id } = req.params;

  let entradas;
  try {
    entradas = await getId(id);
    if (entradas < 1) generarError("La entrada no existe", 400);
    entradas.comments = await getCommentsId(id);
    entradas.fotos = await getFotosId(id);
    entradas.votos = await getVotosId(id);
    if (req.user?.id) {
      const userId = req.user.id;
      entradas.yaVotado = await yaVotado(id, userId);
    }

    res.json(entradas);
  } catch (error) {
    next(error);
  }
}

// Función asincrona para realizar consultas de lugar y/o categoria
async function consulta(req, res, next) {
  let consulta;
  try {
    const { lugar, categoria, votos } = req.query;
    consulta = await getConsulta(lugar, categoria, votos);

    res.json(consulta);
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    await esquemasEntradas.validateAsync(req.body);
    const { titulo, categoria, lugar, texto } = req.body;
    let foto;
    if (req.files?.foto) {
      ({ foto } = req.files);
    }
    const { id } = req.user;
    if (!foto) {
      generarError("Al menos una foto es obligatoria", 400);
    }
    //Guardar fotos en la carpeta fotos

    const savePhoto = await guardarFoto(Array.isArray(foto) ? foto : [foto]);

    //Guardar entrada en la BD

    const insertarEntrada = await entradaNueva(
      titulo,
      categoria,
      lugar,
      texto,
      id,
      savePhoto
    );

    res.json({
      status: "ok",
      message: "Entrada insertada con éxito",
      data: insertarEntrada,
    });
  } catch (error) {
    next(error);
  }
}

async function votarEntrada(req, res, next) {
  try {
    const entradaId = req.params.id;
    const { id } = req.user;
    let votos;
    const votado = await yaVotado(entradaId, id);

    votado
      ? (votos = await quitarVotos(entradaId, id))
      : (votos = await votar(entradaId, id));

    res.json({
      status: "ok",
      message: "Guardado",
      data: votos,
    });
  } catch (error) {
    next(error);
  }
}

// Borrar entrada por usuario

async function borrarEntrada(req, res, next) {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const rutaFotos = path.join(__dirname, "../fotos/");

    const borrar = await deleteEntrada(id, user_id);

    borrar.consultarFotos.forEach(async (foto) => {
      await fs.unlink(rutaFotos + foto.foto);
    });

    if (borrar.borrarEntrada.affectedRows < 1)
      generarError("La entrada no existe.", 404);
    res.json({
      status: "ok",
      message: "Recomendación borrada con éxito",
    });
  } catch (error) {
    next(error);
  }
}

// Controlador para comentar entradas
async function comentarEntrada(req, res, next) {
  try {
    // Recibimos el comentario del usuario o mandamos error
    const { comentario } = req.body;
    const { id } = req.user;
    const { entrada_id } = req.params;
    let nombreFoto;

    if (req.files?.foto) {
      const { foto } = req.files;
      nombreFoto = await guardarFoto([foto]);
    }
    if (!comentario)
      generarError("El campo comentario no puede estar vacio", 400);
    //Guardamos la foto en la carpeta de fotos

    const comentar = await comentarRecomendacion(
      comentario,
      entrada_id,
      id,
      nombreFoto
    );

    res.json({
      status: "ok",
      message: "Comentario insertado con éxito",
      data: comentar,
    });
  } catch (error) {
    next(error);
  }
}

// Esportamos las funciones creadas
module.exports = {
  detalles,
  listar,
  consulta,
  crear,
  votarEntrada,
  borrarEntrada,
  comentarEntrada,
};
