const express = require("express");
const Transaccion = require("../models/Transaccion");
const Directivo = require("../models/Directivo");
const jwt = require("jsonwebtoken");

/*
 * Crea una transaccion a partir de los datos recibidos en el body
 */
const crearTransaccion = async (req, res = express.response) => {
  try {
    const transaccionReq = req.body;
    const transaccion = new Transaccion(transaccionReq);

    // Validar que el usuario es tesorero de la banda
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    const rolesDirectivo = await Directivo.find({
      usuario: payloadId,
      banda: transaccion.banda,
    });
    let esTesorero = false;

    for (let i = 0; i < rolesDirectivo.length; i++) {
      const rol = rolesDirectivo[i];
      if (!rol.fechaFin && rol.cargo === "Tesorero") {
        esTesorero = true;
        break;
      }
    }
    if (!esTesorero) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene permisos para crear esta transacción",
      });
    }

    const transaccionDB = await transaccion.save();

    res.json({
      ok: true,
      transaccionDB,
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
 * Obtiene las transacciones de una banda
 */
const getByBanda = async (req, res = express.response) => {
  try {
    const bandaId = req.params.bandaId;
    // Comprobar que el usuario es directivo
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;
    const rolesDirectivo = await Directivo.find({
      usuario: payloadId,
      banda: bandaId,
    });
    let esDirectivo = false;

    for (let i = 0; i < rolesDirectivo.length; i++) {
      const rol = rolesDirectivo[i];
      if (!rol.fechaFin) {
        esDirectivo = true;
        break;
      }
    }
    if (!esDirectivo) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene permisos para realizar esta operación",
      });
    }

    const transacciones = await Transaccion.find({ banda: bandaId }).sort({
      fecha: 0,
    });
    res.json({
      ok: true,
      transacciones,
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
 * Actualiza una transaccion a partir de los datos recibidos en el body
 */
const actualizarTransaccion = async (req, res = express.response) => {
  try {
    const transaccionReq = req.body;
    const transaccionId = req.params.transaccionId;

    // Validar que el usuario es tesorero de la banda
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    const rolesDirectivo = await Directivo.find({
      usuario: payloadId,
      banda: transaccionReq.banda,
    });
    let esTesorero = false;

    for (let i = 0; i < rolesDirectivo.length; i++) {
      const rol = rolesDirectivo[i];
      if (!rol.fechaFin && rol.cargo === "Tesorero") {
        esTesorero = true;
        break;
      }
    }
    if (!esTesorero) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene permisos para crear esta transacción",
      });
    }

    const transaccionDB = await Transaccion.findByIdAndUpdate(
      transaccionId,
      transaccionReq,
      { new: true }
    );

    res.json({
      ok: true,
      transaccionDB,
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
 * Elimina una transaccion a partir de su id
 */
const deleteById = async (req, res = express.response) => {
  try {
    const transaccionId = req.params.transaccionId;
    const transaccionReq = await Transaccion.findById(transaccionId);

    // Validar que el usuario es tesorero de la banda
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    const rolesDirectivo = await Directivo.find({
      usuario: payloadId,
      banda: transaccionReq.banda,
    });
    let esTesorero = false;

    for (let i = 0; i < rolesDirectivo.length; i++) {
      const rol = rolesDirectivo[i];

      if (!rol.fechaFin && rol.cargo === "Tesorero") {
        esTesorero = true;
        break;
      }
    }
    if (!esTesorero) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene permisos para crear esta transacción",
      });
    }

    await Transaccion.findByIdAndDelete(transaccionId);

    res.json({
      ok: true,
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
 * Obtiene las transacciones de una banda en el último año
 */
const getTransaccionesUltimoAño = async (req, res = express.response) => {
  try {
    const bandaId = req.params.bandaId;
    // Comprobar que el usuario es directivo
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;
    const rolesDirectivo = await Directivo.find({
      usuario: payloadId,
      banda: bandaId,
      fechaFin: null,
    });
    if (rolesDirectivo.length === 0) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene permisos para realizar esta operación",
      });
    }

    const fechaActual = new Date();
    const fechaInicio = new Date(
      fechaActual.getFullYear() - 1,
      fechaActual.getMonth(),
      fechaActual.getDate()
    );
    // Buscar transacciones ordenado por primero por año, luego por mes, y luego por dia
    const transacciones = await Transaccion.find({
      banda: bandaId,
      fecha: { $gte: fechaInicio },
    }).sort({ fecha: 0 });
    res.json({
      ok: true,
      transacciones,
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
  crearTransaccion,
  getByBanda,
  actualizarTransaccion,
  deleteById,
  getTransaccionesUltimoAño,
};
