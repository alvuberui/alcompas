const express = require("express");
const Archivero = require("../models/Archivero");
const Directivo = require("../models/Directivo");
const jwt = require("jsonwebtoken");

/*
* Obtener todos los roles de archiveros de un usuario
*/
const getArchiveroByUserId = async (req, res = express.response) => {
  try {
    const usuarioId = req.params.userId;
    const archivero = await Archivero.find({ usuario: usuarioId });
    return res.status(201).json({
      ok: true,
      archivero,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador.",
    });
  }
};

/*
* Verificar si un usuario es archivero de una banda
*/
const esArchiveroByBandaId = async (req, res = express.response) => {
  try {
    const bandaId = req.params.bandaId;
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;
    const archivero = await Archivero.find({
      usuario: payloadId,
      banda: bandaId,
      fecha_final: undefined,
    });

    let esArchivero = false;
    if (archivero.length > 0) {
      esArchivero = true;
    }
    return res.status(201).json({
      ok: true,
      esArchivero,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador.",
    });
  }
};

/*
* Obtener todos los archiveros de una banda
*/
const obtenerArchiverosByBanda = async (req, res = express.response) => {
  try {
    const bandaId = req.params.bandaId;
    const archiveros = await Archivero.find({
      banda: bandaId,
      fecha_final: undefined,
    });

    const diccionario = {};
    for (i = 0; i < archiveros.length; i++) {
      let archivero = archiveros[i];
      if (diccionario["Archivero"] == undefined) {
        diccionario["Archivero"] = [archivero];
      } else {
        diccionario["Archivero"] = [...diccionario["Archivero"], archivero];
      }
    }
    return res.status(201).json({
      ok: true,
      diccionario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador.",
    });
  }
};

/*
* Finalizar un archivero
*/
const finalizarArchivero = async (req, res = express.response) => {
  try {
    const userId = req.params.userId;
    const bandaId = req.params.bandaId;
    const archiveros = await Archivero.find({
      usuario: userId,
      banda: bandaId,
      fecha_final: undefined,
    });
    if (archiveros.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un músico con ese id",
      });
    }

    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;
    let condicion = false;
    let condicion2 = false;

    if (payloadId === userId) {
      condicion2 = true;
    }

    const ds = await Directivo.find({
      usuario: payloadId,
      banda: bandaId,
      fecha_final: undefined,
    });
    if (ds.length > 0) {
      condicion = true;
    }
    if (condicion === false && condicion2 === false) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegios para realizar esta acción",
      });
    }

    archiveros[0].fecha_final = new Date();
    const newArchivero = new Archivero(archiveros[0]);
    const archiveroDB = await newArchivero.save();

    res.status(201).json({
      ok: true,
      archiveroDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador.",
    });
  }
};

module.exports = {
  finalizarArchivero,
  getArchiveroByUserId,
  esArchiveroByBandaId,
  obtenerArchiverosByBanda,
};
