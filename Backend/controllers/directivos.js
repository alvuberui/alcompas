const express = require("express");
const Banda = require("../models/Banda");
const Musico = require("../models/Musico");
const Archivero = require("../models/Archivero");
const Directivo = require("../models/Directivo");
const Usuario = require("../models/Usuario");
const RedSocial = require("../models/RedSocial");
const Comentario = require("../models/Comentario");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const Peticion = require("../models/Peticion");
const Like = require("../models/Like");
const Transaccion = require("../models/Transaccion");
const Noticia = require("../models/Noticia");
const Actuacion = require("../models/Actuacion");
const Ensayo = require("../models/Ensayo");
const Procesion = require("../models/Procesion");
const Repertorio = require("../models/Repertorio");
const Instrumento = require("../models/Instrumento");
const Vestimenta = require("../models/Vestimenta");
const mongoose = require("mongoose");
const Contratado = require("../models/Contratado");
const Prestamo = require("../models/Prestamo");
const Obra = require("../models/Obra");
const Partitura = require("../models/Partitura");
const Asistencia = require("../models/Asistencia");

/*
 * Finalizar un directivo
 */
const finalizarDirectivo = async (req, res = express.response) => {
  try {
    const userId = req.params.userId;
    const bandaId = req.params.bandaId;

    // Validar que el usuario es directivo de la banda
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;
    let condicion = false;

    const ds = await Directivo.find({
      usuario: payloadId,
      banda: bandaId,
      fecha_final: undefined,
    });

    if (ds.length > 0) {
      condicion = true;
    }

    if (!condicion && payloadId !== userId) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegios para realizar esta acción",
      });
    }

    const directivo = await Directivo.find({
      usuario: userId,
      banda: bandaId,
      fecha_final: undefined,
    });

    if (!directivo) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un directivo con ese id",
      });
    }

    directivo[0].fecha_final = new Date();
    const newDirectivo = new Directivo(directivo[0]);
    const directivoDB = await newDirectivo.save();

    const directivos = await Directivo.find({
      banda: bandaId,
      fecha_final: undefined,
    });

    if (directivos.length === 0) {
      const banda = await Banda.findById(bandaId);
      const archiveros = await Archivero.find({ banda: bandaId });
      const musicos = await Musico.find({ banda: bandaId });
      const directivos = await Directivo.find({ banda: bandaId });
      for (i = 0; i < archiveros.length; i++) {
        let archivero = archiveros[i];
        if (!archivero.fecha_final) {
          archivero.fecha_final = new Date();
          await archivero.save();
        }
      }
      for (i = 0; i < musicos.length; i++) {
        let musico = musicos[i];
        if (!musico.fecha_final) {
          musico.fecha_final = new Date();
          await musico.save();
        }
      }
      for (i = 0; i < directivos.length; i++) {
        let directivo = directivos[i];
        if (!directivo.fecha_final) {
          directivo.fecha_final = new Date();
          await directivo.save();
        }
      }
      // Eliminamos todas las composiciones de la banda
    const redes = await RedSocial.find({ banda: bandaId });
    const comentarios = await Comentario.find({ banda: bandaId });

    //Eliminar todas las asistencias de los eventos de la banda y sus contratados
    const procesiones = await Procesion.find({ banda: bandaId });
    const actuaciones = await Actuacion.find({ banda: bandaId });
    const ensayos = await Ensayo.find({ banda: bandaId });

    for (i = 0; i < procesiones.length; i++) {
      let procesion = procesiones[i];
      await Asistencia.deleteMany({ referencia: procesion._id });
      await Contratado.deleteMany({ referencia: procesion._id });
    }

    for (i = 0; i < actuaciones.length; i++) {
      let actuacion = actuaciones[i];
      await Asistencia.deleteMany({ referencia: actuacion._id });
      await Contratado.deleteMany({ referencia: actuacion._id });
    }

    for (i = 0; i < ensayos.length; i++) {
      let ensayo = ensayos[i];
      await Asistencia.deleteMany({ referencia: ensayo._id });
      await Contratado.deleteMany({ referencia: ensayo._id });
    }

    // Eliminamos todos los prestamos de vestimentas y de instrumentos de la banda
    const instrumentos = await Instrumento.find({ banda: bandaId });
    const vestimentas = await Vestimenta.find({ banda: bandaId });

    for (i = 0; i < instrumentos.length; i++) {
      let instrumento = instrumentos[i];
      await Prestamo.deleteMany({ referencia: instrumento._id });
    }

    for (i = 0; i < vestimentas.length; i++) {
      let vestimenta = vestimentas[i];
      await Prestamo.deleteMany({ referencia: vestimenta._id });
    }

    // Eliminar todas las obras y sus partituras 
    const repertorios = await Repertorio.find({ banda: bandaId });

    for (i = 0; i < repertorios.length; i++) {
      let repertorio = repertorios[i];
      const obras = await Obra.find({ repertorio: repertorio._id });
      for (j = 0; j < obras.length; j++) {
        let obra = obras[j];
        const partituras = await Partitura.find({ obra: obra._id });
        for (k = 0; k < partituras.length; k++) {
          let partitura = partituras[k];
          const pathImagen = path.join(
            __dirname,
            "../public/uploads/partituras/",
            partitura.url
          );
          if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
          }
          await partitura.remove();
        }
        await obra.remove();
      }
      await repertorio.remove();
    }



    await Like.deleteMany({ banda: bandaId });
    await Transaccion.deleteMany({ banda: bandaId });
    await Noticia.deleteMany({ banda: bandaId });
    await Procesion.deleteMany({ banda: bandaId });
    await Ensayo.deleteMany({ banda: bandaId });
    await Actuacion.deleteMany({ banda: bandaId });
    await Repertorio.deleteMany({ banda: bandaId });
    await Instrumento.deleteMany({ banda: bandaId });
    await Vestimenta.deleteMany({ banda: bandaId });
    await Peticion.deleteMany({ banda: bandaId });

    for (i = 0; i < redes.length; i++) {
      let red = redes[i];
      await red.remove();
    }
    for (i = 0; i < comentarios.length; i++) {
      let comentario = comentarios[i];
      await comentario.remove();
    }

    // Eliminamos la foto de perfil de la banda
    if (banda.img) {
      const pathImagen = path.join(
        __dirname,
        "../public/uploads/imgs/bandas",
        banda.img
      );
      const pathImagen2 = path.join(
        __dirname,
        "../public/uploads/opt/bandas",
        banda.img
      );
      if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
        fs.unlinkSync(pathImagen2);
      }
    }

    // Eliminamos aquellas peticiones de la banda cuyos usuarios no existan
    const peticiones = await Peticion.find({ banda: bandaId });
    for (i = 0; i < peticiones.length; i++) {
      let peticion = peticiones[i];
      const usuario = await Usuario.findById(peticion.usuario);
      if (!usuario) {
        await peticion.remove();
      }
    }
      await Banda.deleteOne({ _id: bandaId });
    }

    res.status(201).json({
      ok: true,
      directivoDB,
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
 * Obtener directivo por id
 */
const getDirectivoById = async (req, res = express.response) => {
  try {
    const directivoId = req.params.id;
    const directivo = await Directivo.findById(directivoId);

    res.status(201).json({
      ok: true,
      directivo,
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
 * Obtener directivo por id de usuario
 */
const getDirectivoByUserId = async (req, res = express.response) => {
  try {
    const usuarioId = req.params.id;
    const directivo = await Directivo.find({ usuario: usuarioId });

    res.status(201).json({
      ok: true,
      directivo,
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
 * Obtener directivo por id de banda
 */
const getDirectivoByBandaId = async (req, res = express.response) => {
  try {
    const bandaId = req.params.id;
    const directivos = await Directivo.find({
      banda: bandaId,
      fecha_final: undefined,
    });

    const diccionario = {};
    for (i = 0; i < directivos.length; i++) {
      let directivo = directivos[i];
      if (diccionario[directivo.cargo] == undefined) {
        diccionario[directivo.cargo] = [directivo];
      } else {
        diccionario[directivo.cargo] = [
          ...diccionario[directivo.cargo],
          directivo,
        ];
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

module.exports = {
  finalizarDirectivo,
  getDirectivoById,
  getDirectivoByUserId,
  getDirectivoByBandaId,
};
