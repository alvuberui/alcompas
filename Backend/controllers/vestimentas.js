const express = require("express");
const Vestimenta = require("../models/Vestimenta");
const Directivo = require("../models/Directivo");
const Prestamo = require("../models/Prestamo");
const jwt = require("jsonwebtoken");

/*
    Crear una vestimenta
*/
const crearVestimenta = async (req, res = express.response) => {
  try {
    const vestimenta = req.body;

    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    // Comprobar que es directivo de la banda
    const directivos = await Directivo.find({
      usuario: payloadId,
      banda: vestimenta.banda,
      fecha_final: undefined,
    });
    if (directivos.length == 0) {
      return res.status(400).json({
        ok: false,
        msg: "No tiene permisos para crear esta vestimenta",
      });
    }

    const nuevaVestimenta = new Vestimenta(vestimenta);
    await nuevaVestimenta.save();
    res.json({
      ok: true,
      nuevaVestimenta,
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
    Obtener todas las vestimentas de una banda
*/
const getTodasVestimentasByBanda = async (req, res = express.response) => {
  try {
    const { banda } = req.params;
    // Comprobar si es directivo
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    const directivos = await Directivo.find({
      usuario: payloadId,
      banda: banda,
      fecha_final: undefined,
    });
    if (directivos.length == 0) {
      return res.status(400).json({
        ok: false,
        msg: "No tiene permisos para ver las vestimentas de esta banda",
      });
    }

    const vestimentas = await Vestimenta.find({ banda: banda });
    res.json({
      ok: true,
      vestimentas,
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
    Editar una vestimenta
*/
const editarVestimenta = async (req, res = express.response) => {
  try {
    const { id } = req.params;
    const vestimenta = req.body;

    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    // Comprobar que es directivo de la banda
    const directivos = await Directivo.find({
      usuario: payloadId,
      banda: vestimenta.banda,
      fecha_final: undefined,
    });
    if (directivos.length == 0) {
      return res.status(400).json({
        ok: false,
        msg: "No tiene permisos para editar esta vestimenta",
      });
    }

    // Se edita la vestimenta
    const nuevaVestimenta = await Vestimenta.findByIdAndUpdate(id, vestimenta, {
      new: true,
    });

    res.json({
      ok: true,
      nuevaVestimenta,
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
    Eliminar una vestimenta
*/
const eliminarVestimenta = async (req, res = express.response) => {
  try {
    const { id } = req.params;
    const vestimenta = await Vestimenta.findById(id);
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    // Comprobar que es directivo de la banda
    const directivos = await Directivo.find({
      usuario: payloadId,
      banda: vestimenta.banda,
      fecha_final: undefined,
    });
    if (directivos.length == 0) {
      return res.status(400).json({
        ok: false,
        msg: "No tiene permisos para eliminar esta vestimenta",
      });
    }

    // Se elimina la vestimenta
    const vestimentaEliminada = await Vestimenta.findByIdAndDelete(id);
    await Prestamo.deleteMany({ referencia: id, tipo: "Vestimenta" });
    res.json({
      ok: true,
      vestimentaEliminada,
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
    Obtener todos los instrumentos con prestamos activos
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

    const vestimentas = await Vestimenta.find({ banda: bandaId });
    const lista = [];
    for (let i = 0; i < vestimentas.length; i++) {
      const vestimenta = vestimentas[i];
      const prestamo = await Prestamo.find({
        referencia: vestimenta._id,
        estado: "Activo",
        tipo: "Vestimenta",
      });
      if (prestamo.length > 0) {
        lista.push(vestimenta);
      }
    }
    res.json({
      ok: true,
      vestimentas: lista,
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
    Obtener todos los instrumentos sin prestamos activos
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

    const vestimentas = await Vestimenta.find({ banda: bandaId });
    const lista = [];
    for (let i = 0; i < vestimentas.length; i++) {
      const vestimenta = vestimentas[i];
      const prestamo = await Prestamo.find({
        referencia: vestimenta._id,
        estado: "Activo",
        tipo: "Vestimenta",
      });
      if (prestamo.length === 0) {
        lista.push(vestimenta);
      }
    }

    res.json({
      ok: true,
      vestimentas: lista,
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
  crearVestimenta,
  getTodasVestimentasByBanda,
  editarVestimenta,
  eliminarVestimenta,
  obtenerTodosConPrestamosByBanda,
  obtenerTodosInstrumentosSinPrestarByBanda,
};
