const express = require("express");
const Instrumento = require("../models/Instrumento");
const Directivo = require("../models/Directivo");
const Banda = require("../models/Banda");
const jwt = require("jsonwebtoken");
const Prestamo = require("../models/Prestamo");

/*
    Obtener instrumentos de un usuario
*/
const getInstrumentosByUserId = async (req, res = express.response) => {
  try {
    const userId = req.params.userId;
    const instrumentos = await Instrumento.find({ usuario: userId });
    res.json({
      ok: true,
      instrumentos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

/*
    Obtener instrumento por id
*/
const getinstrumentosById = async (req, res = express.response) => {
  try {
    const instrumentoId = req.params.instrumentoId;
    const instrumento = await Instrumento.findById(instrumentoId);
    res.json({
      ok: true,
      instrumento,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

/*
    Crear instrumento
*/
const crearInstrumentoUsuario = async (req, res = express.response) => {
  try {
    const instrumento = req.body;

    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    if (instrumento.usuario != payloadId) {
      return res.status(400).json({
        ok: false,
        msg: "No tiene permisos",
      });
    }

    const nuevoInstrumento = new Instrumento(instrumento);
    const instrumentoGuardado = await nuevoInstrumento.save();
    res.json({
      ok: true,
      instrumentoGuardado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

/*
    Eliminar instrumento
*/
const eliminarInstrumento = async (req, res = express.response) => {
  try {
    const instrumentoId = req.params.instrumentoId;
    const instrumento = await Instrumento.findById(instrumentoId);
    if (!instrumento) {
      return res.status(404).json({
        ok: false,
        msg: "Instrumento no encontrado",
      });
    }

    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    if (instrumento.usuario != payloadId) {
      return res.status(400).json({
        ok: false,
        msg: "No tiene permisos",
      });
    }

    await Instrumento.findByIdAndDelete(instrumentoId);
    res.json({
      ok: true,
      msg: "Instrumento eliminado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

/*
    Actualizar instrumento
*/
const actualizarInstrumentoUsuario = async (req, res = express.response) => {
  try {
    const instrumentoId = req.params.instrumentoId;
    const instrumento = await Instrumento.findById(instrumentoId);
    if (!instrumento) {
      return res.status(404).json({
        ok: false,
        msg: "Instrumento no encontrado",
      });
    }

    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    if (instrumento.usuario != payloadId) {
      return res.status(400).json({
        ok: false,
        msg: "No tiene permisos para crear este instrumento",
      });
    }

    const nuevoInstrumento = {
      ...req.body,
    };
    const instrumentoActualizado = await Instrumento.findByIdAndUpdate(
      instrumentoId,
      nuevoInstrumento,
      { new: true }
    );
    res.json({
      ok: true,
      instrumentoActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

/*
    Crear instrumento para una banda
*/
const crearInstrumentoBanda = async (req, res = express.response) => {
  try {
    const instrumento = req.body;

    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    // Comprobar que la banda existe
    const banda = await Banda.findById(instrumento.banda);
    if (!banda) {
      return res.status(404).json({
        ok: false,
        msg: "Banda no encontrada",
      });
    }

    // Comprobar si es directivo de la banda
    const directivos = await Directivo.find({
      usuario: payloadId,
      banda: instrumento.banda,
      fecha_final: undefined,
    });
    if (directivos.length === 0) {
      return res.status(400).json({
        ok: false,
        msg: "No tiene permisos para crear este instrumento",
      });
    }

    const nuevoInstrumento = new Instrumento(instrumento);
    const instrumentoGuardado = await nuevoInstrumento.save();
    res.json({
      ok: true,
      instrumentoDB: instrumentoGuardado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

/*
    Obtener todos los instrumentos de una banda
*/
const getTodosInstrumentosByBanda = async (req, res = express.response) => {
  try {
    const bandaId = req.params.bandaId;
    // Comprobar que eres directivo de la banda
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    const directivos = await Directivo.find({
      usuario: payloadId,
      banda: bandaId,
      fecha_final: undefined,
    });
    if (directivos.length === 0) {
      return res.status(400).json({
        ok: false,
        msg: "No tiene permisos para crear este instrumento",
      });
    }

    const instrumentos = await Instrumento.find({ banda: bandaId });
    res.json({
      ok: true,
      instrumentos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

/*
    Editar instrumento de una banda
*/
const editarInstrumentoBanda = async (req, res = express.response) => {
  try {
    const instrumentoId = req.params.instrumentoId;
    const instrumento = await Instrumento.findById(instrumentoId);
    if (!instrumento) {
      return res.status(404).json({
        ok: false,
        msg: "Instrumento no encontrado",
      });
    }

    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;
    // Comprobar que eres directivo de la banda
    const directivos = await Directivo.find({
      usuario: payloadId,
      banda: instrumento.banda,
      fecha_final: undefined,
    });
    if (directivos.length === 0) {
      return res.status(400).json({
        ok: false,
        msg: "No tiene permisos para crear este instrumento",
      });
    }

    const nuevoInstrumento = {
      ...req.body,
    };
    const instrumentoActualizado = await Instrumento.findByIdAndUpdate(
      instrumentoId,
      nuevoInstrumento,
      { new: true }
    );
    res.json({
      ok: true,
      instrumentoActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

/*
    Eliminar instrumento de una banda
*/
const eliminarInstrumentoBanda = async (req, res = express.response) => {
  try {
    const instrumentoId = req.params.instrumentoId;
    const instrumento = await Instrumento.findById(instrumentoId);
    // Comprobar que es directivo
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;
    // Comprobar que eres directivo de la banda
    const directivos = await Directivo.find({
      usuario: payloadId,
      banda: instrumento.banda,
      fecha_final: undefined,
    });
    if (directivos.length === 0) {
      return res.status(400).json({
        ok: false,
        msg: "No tiene permisos para crear este instrumento",
      });
    }

    const instrumentoEliminado = await Instrumento.findByIdAndDelete(
      instrumentoId
    );
    await Prestamo.deleteMany({
      referencia: instrumentoId,
      tipo: "Instrumento",
    });
    res.json({
      ok: true,
      instrumentoEliminado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

/*
    Obtener todos los instrumentos sin prestar de una banda
*/
const obtenerTodosInstrumentosSinPrestarByBanda = async (
  req,
  res = express.response
) => {
  try {
    const bandaId = req.params.bandaId;
    // Comprobar que eres directivo de la banda
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    const directivos = await Directivo.find({
      usuario: payloadId,
      banda: bandaId,
      fecha_final: undefined,
    });
    if (directivos.length === 0) {
      return res.status(400).json({
        ok: false,
        msg: "No tiene permisos para crear este instrumento",
      });
    }

    const instrumentos = await Instrumento.find({ banda: bandaId });
    const lista = [];
    for (let i = 0; i < instrumentos.length; i++) {
      const instrumento = instrumentos[i];
      const prestamo = await Prestamo.find({
        referencia: instrumento._id,
        estado: "Activo",
        tipo: "Instrumento",
      });

      if (prestamo.length === 0) {
        lista.push(instrumento);
      }
    }
    res.json({
      ok: true,
      instrumentos: lista,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

/*
    Obtener todos los instrumentos con prestamos activos de una banda
*/
const obtenerTodosConPrestamosByBanda = async (req, res = express.response) => {
  try {
    const bandaId = req.params.bandaId;
    // Comprobar que eres directivo de la banda
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    const directivos = await Directivo.find({
      usuario: payloadId,
      banda: bandaId,
      fecha_final: undefined,
    });
    if (directivos.length === 0) {
      return res.status(400).json({
        ok: false,
        msg: "No tiene permisos para crear este instrumento",
      });
    }

    const instrumentos = await Instrumento.find({ banda: bandaId });
    const lista = [];
    for (let i = 0; i < instrumentos.length; i++) {
      const instrumento = instrumentos[i];
      const prestamo = await Prestamo.find({
        referencia: instrumento._id,
        estado: "Activo",
        tipo: "Instrumento",
      });
      if (prestamo.length > 0) {
        lista.push(instrumento);
      }
    }
    res.json({
      ok: true,
      instrumentos: lista,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

module.exports = {
  crearInstrumentoUsuario,
  getInstrumentosByUserId,
  eliminarInstrumento,
  actualizarInstrumentoUsuario,
  getinstrumentosById,
  crearInstrumentoBanda,
  getTodosInstrumentosByBanda,
  editarInstrumentoBanda,
  eliminarInstrumentoBanda,
  obtenerTodosInstrumentosSinPrestarByBanda,
  obtenerTodosConPrestamosByBanda,
};
