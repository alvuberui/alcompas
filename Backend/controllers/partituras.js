const express = require("express");
const Directivo = require("../models/Directivo");
const Musico = require("../models/Musico");
const { subirPartitura } = require("../helpers/subir-archivo");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const Obra = require("../models/Obra");
const Repertorio = require("../models/Repertorio");
const Archivero = require("../models/Archivero");
const Partitura = require("../models/Partitura");
const { validarInstrumentos } = require("../middlewares/validar-instrumento");
const { validarVoz } = require("../middlewares/validar-voz");

/*
    Crear una partitura
*/
const crearPartitura = async (req, res = express.response) => {
  try {
    const request = req.body;

    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    const datos = JSON.parse(request.partitura);

    if (
      validarInstrumentos(datos.instrumento) === false ||
      validarVoz(datos.voz) === false
    ) {
      return res.status(400).json({
        ok: false,
        msg: "El instrumento o la voz no son válidos",
      });
    }

    const obra = await Obra.findById(datos.obra);
    if (!obra) {
      return res.status(404).json({
        ok: false,
        msg: "No existe la obra",
      });
    }

    const repertorio = await Repertorio.findById(obra.repertorio);
    const archiveros = await Archivero.find({
      usuario: payloadId,
      banda: repertorio.banda,
      fecha_final: undefined,
    });

    if (archiveros.length === 0) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegios para crear partituras",
      });
    }
    const nombre = await subirPartitura(req.files, undefined, "partituras");
    datos.url = nombre;
    const partitura = new Partitura(datos);
    const nuevaPartitura = await partitura.save();
    return res.json({
      ok: true,
      nuevaPartitura,
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
    Ver mis partituras
*/
const verMisParituras = async (req, res = express.response) => {
  try {
    const obraId = req.params.obraId;
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    const obra = await Obra.findById(obraId);

    if (!obra) {
      return res.status(404).json({
        ok: false,
        msg: "No existe la obra",
      });
    }

    const repertorio = await Repertorio.findById(obra.repertorio);

    if (!repertorio) {
      return res.status(404).json({
        ok: false,
        msg: "No existe el repertorio",
      });
    }

    // Depende de si el usuario es directivo, archivero o musico se le
    // muestran todas o no.
    const archiveros = await Archivero.find({
      usuario: payloadId,
      banda: repertorio.banda,
      fecha_final: undefined,
    });
    const directivos = await Directivo.find({
      usuario: payloadId,
      banda: repertorio.banda,
      fecha_final: undefined,
    });
    let partituras = [];
    if (archiveros.length > 0 || directivos.length > 0) {
      partituras = await Partitura.find({ obra: obraId });
      return res.json({
        ok: true,
        partituras,
      });
    }

    const musicos = await Musico.find({
      usuario: payloadId,
      banda: repertorio.banda,
      fecha_final: undefined,
    });

    if (musicos.length > 0) {
      partituras = await Partitura.find({
        obra: obraId,
        instrumento: musicos[0].instrumento,
      });
      return res.json({
        ok: true,
        partituras,
      });
    }

    if (
      archiveros.length === 0 &&
      directivos.length === 0 &&
      musicos.length === 0
    ) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegios para ver partituras",
      });
    }

    return res.json({
      ok: true,
      partituras,
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
    Obtener partitura por id
*/
const getPartituraById = async (req, res = express.response) => {
  try {
    const partituraId = req.params.partituraId;
    // Comprobamos que es musico y que toca el instrumento de la partitura
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    const partitura = await Partitura.findById(partituraId);

    if (!partitura) {
      return res.status(404).json({
        ok: false,
        msg: "No existe la partitura",
      });
    }

    const obra = await Obra.findById(partitura.obra);
    if (!obra) {
      return res.status(404).json({
        ok: false,
        msg: "No existe la obra",
      });
    }

    const repertorio = await Repertorio.findById(obra.repertorio);
    if (!repertorio) {
      return res.status(404).json({
        ok: false,
        msg: "No existe el repertorio",
      });
    }

    const musicos = await Musico.find({
      usuario: payloadId,
      banda: repertorio.banda,
      fecha_final: undefined,
    });
    const archiveros = await Archivero.find({
      usuario: payloadId,
      banda: repertorio.banda,
      fecha_final: undefined,
    });
    const directivos = await Directivo.find({
      usuario: payloadId,
      banda: repertorio.banda,
      fecha_final: undefined,
    });

    if (
      musicos.length === 0 &&
      archiveros.length === 0 &&
      directivos.length === 0
    ) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegios para ver partituras",
      });
    }
    if (
      musicos.length > 0 &&
      musicos[0].instrumento !== partitura.instrumento &&
      directivos.length === 0 &&
      archiveros.length === 0
    ) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegios para ver partituras",
      });
    }

    const pathImagen = path.join(
      __dirname,
      "../uploads/partituras/",
      partitura.url
    );
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    } else {
      return res.status(404).json({
        ok: false,
        msg: "No existe la partitura",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

/*
    Eliminar partitura
*/
const eliminarPartitura = async (req, res = express.response) => {
  try {
    const partituraId = req.params.partituraId;

    // Comprobamos que es archivero
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    const partitura = await Partitura.findById(partituraId);
    if (!partitura) {
      return res.status(404).json({
        ok: false,
        msg: "No existe la partitura",
      });
    }

    const obra = await Obra.findById(partitura.obra);
    if (!obra) {
      return res.status(404).json({
        ok: false,
        msg: "No existe la obra",
      });
    }

    const repertorio = await Repertorio.findById(obra.repertorio);
    if (!repertorio) {
      return res.status(404).json({
        ok: false,
        msg: "No existe el repertorio",
      });
    }

    const archiveros = await Archivero.find({
      usuario: payloadId,
      banda: repertorio.banda,
      fecha_final: undefined,
    });
    if (archiveros.length === 0) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegios para eliminar partituras",
      });
    }

    const pathImagen = path.join(
      __dirname,
      "../uploads/partituras/",
      partitura.url
    );
    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }

    await Partitura.findByIdAndDelete(partituraId);

    return res.json({
      ok: true,
      msg: "Partitura eliminada",
      partitura,
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
  crearPartitura,
  verMisParituras,
  getPartituraById,
  eliminarPartitura,
};
