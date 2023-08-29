const {
  getAll,
  getConsulta,
  entradaNueva,
  votar,
  getId,
  deleteEntrada,
  comentarRecomendacion
} = require("../db/queries/queriesentradas");
const generarError = require("../helpers/generarError");
const esquemasEntradas = require("../schemas/esquemasentradas");
const guardarFoto = require("../servicios/savephoto");

// Función asincrona para listar de todas las entradas
async function listar(req, res, next) {
  let entradas;
  try {
    if (!req.body.votos) {
      entradas = await getAll();
    } else {
      const { votos } = req.body;
      entradas = await getAll(votos);
    }
    res.json(entradas);
  } catch (error) {
    next(error);
  }
}

// Función asíncrona para ver detalles de una entrada recomendada

async function detalles(req, res, next) {
  const {id} = req.params
  let entradas;
  try {
    entradas = await getId(id);
    if (entradas < 1) generarError ("La entrada no existe", 400)
    res.json(entradas);
  } catch (error) {
    next(error);
  }
}


// Función asincrona para realizar consultas de lugar y/o categoria
async function consulta(req, res, next) {
  let consulta;
  try {
    if (!req.body.votos) {
      const { lugar, categoria } = req.body;
      consulta = await getConsulta(lugar, categoria);
    } else {
      const { lugar, categoria, votos } = req.body;
      consulta = await getConsulta(lugar, categoria, votos);
    }
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
    if(req.files?.foto) {
      ({ foto } = req.files)
    }
    const { id } = req.user
    if (!foto) {
      generarError("Al menos una foto es obligatoria", 400);
    }
    //Guardar fotos en la carpeta fotos
    
    
    const savePhoto = await guardarFoto(foto);

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
    const { id } = req.params;
    const votos = await votar(id);

    res.json({
      status: "ok",
      message: "voto sumado con éxito",
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
    
    const borrar = await deleteEntrada(id);

    if (borrar.affectedRows < 1) generarError ("La entrada no existe.", 404)
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
    const { comentario} = req.body;
    const { id } = req.user;
    const { entrada_id } = req.params;
    let nombreFoto;

    if(req.files?.foto) {
      const { foto } = req.files;
      nombreFoto = await guardarFoto([foto]);
    }
    if(!comentario)generarError('El campo comentario no puede estar vacio', 400);
    //Guardamos la foto en la carpeta de fotos
    
    
    const comentar = await comentarRecomendacion(comentario, entrada_id, id, nombreFoto);

    res.json({
      status: "ok",
      message: 'Comentario insertado con éxito',
      data: comentar
    });

    
  } catch (error) {
    next(error);
  }
}

// Esportamos las funciones creadas
module.exports = { detalles, listar, consulta, crear, votarEntrada, borrarEntrada, comentarEntrada };