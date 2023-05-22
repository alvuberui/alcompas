const jwt = require("jsonwebtoken");
const express = require("express");
const Directivo = require("../models/Directivo");
const Asistencia = require("../models/Asistencia");
const Procesion = require("../models/Procesion");
const Actuacion = require("../models/Actuacion");
const Ensayo = require("../models/Ensayo");
const Musico = require("../models/Musico");
const Archivero = require("../models/Archivero");
const Usuario = require("../models/Usuario");

/*
 * Comprobar si pertenece a una banda
 */
const perteneceABanda = async (payloadId, asistencia) => {
  // Obtenemos el evento
  let evento;
  switch (asistencia.tipo) {
    case "Procesion":
      evento = await Procesion.findById(asistencia.referencia);
      break;
    case "Actuacion":
      evento = await Actuacion.findById(asistencia.referencia);
      break;
    case "Ensayo":
      evento = await Ensayo.findById(asistencia.referencia);
      break;
  }

  // Comprobar que pertenece a la banda
  const esMusico =
    (
      await Musico.find({
        usuario: payloadId,
        banda: evento.banda,
        fecha_final: undefined,
      })
    ).length > 0
      ? true
      : false;
  const esDirectivo =
    (
      await Directivo.find({
        usuario: payloadId,
        banda: evento.banda,
        fecha_final: undefined,
      })
    ).length > 0
      ? true
      : false;
  const esArchivero =
    (
      await Archivero.find({
        usuario: payloadId,
        banda: evento.banda,
        fecha_final: undefined,
      })
    ).length > 0
      ? true
      : false;
      
  if (!esMusico && !esDirectivo && !esArchivero) {
    return false;
  } else {
    return true;
  }
};

/*
 * Comprobar si el evento es futuro
 */
const esEventoFuturo = async (asistencia) => {
  // Obtenemos el evento
  let evento;
  switch (asistencia.tipo) {
    case "Procesion":
      evento = await Procesion.findById(asistencia.referencia);
      break;
    case "Actuacion":
      evento = await Actuacion.findById(asistencia.referencia);
      break;
    case "Ensayo":
      evento = await Ensayo.findById(asistencia.referencia);
      break;
  }

  // Comprobar que el evento es futuro
  const fechaActual = new Date();

  if (evento.fechaInicio <= fechaActual) {
    return false;
  } else {
    return true;
  }
};

/*
 * Crear una asistencia
 */
const crearAsistencia = async (req, res = express.response) => {
  try {
    const asistencia = new Asistencia(req.body);

    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    const perteneceBanda = await perteneceABanda(payloadId, asistencia);

    if (!perteneceBanda) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegios para realizar esta acción",
      });
    }

    const esFuturo = await esEventoFuturo(asistencia);

    if (esFuturo === false) {
      return res.status(400).json({
        ok: false,
        msg: "No se puede crear una asistencia a un evento que ya ha pasado",
      });
    }

    // Comprobar que no existe una asistencia con el mismo usuario y banda
    const asistencias = await Asistencia.find({
      usuario: payloadId,
      referencia: asistencia.referencia,
      tipo: asistencia.tipo,
    });
    if (asistencias.length > 0) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe una asistencia con el mismo usuario y evento",
      });
    }

    // Guardar asistencia
    const asistenciaDB = await asistencia.save();

    res.status(201).json({
      ok: true,
      asistenciaDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

/*
 * Actualizar una asistencia
 */
const actualizarAsistencia = async (req, res = express.response) => {
  try {
    const asistenciaId = req.params.id;
    const asistencia = new Asistencia(req.body);

    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    const perteneceBanda = await perteneceABanda(payloadId, asistencia);

    if (!perteneceBanda) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegios para realizar esta acción",
      });
    }

    const esFuturo = await esEventoFuturo(asistencia);

    if (esFuturo === false) {
      return res.status(400).json({
        ok: false,
        msg: "No se puede crear una asistencia a un evento que ya ha pasado",
      });
    }

    asistencia.usuario = payloadId;
    // Actuaizar asistencia

    const asistenciaDB = await Asistencia.findByIdAndUpdate(
      asistenciaId,
      asistencia,
      { new: true }
    );

    res.status(201).json({
      ok: true,
      asistenciaDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

/*
 * Obtener una asistencia por usuario, evento y tipo
 */
const getAsistenciaByUsuarioEventoAndTipo = async (
  req,
  res = express.response
) => {
  try {
    const usuarioId = req.params.usuarioId;
    const eventoId = req.params.eventoId;
    const tipo = req.params.tipoEvento;
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    let asistencia = await Asistencia.find({
      usuario: usuarioId,
      referencia: eventoId,
      tipo: tipo,
    });

    // Comprobar que el usuario de la asistencia es el mismo del token o que es directivo de la banda
    let evento;
    switch (tipo) {
      case "Procesion":
        evento = await Procesion.findById(eventoId);
        break;
      case "Actuacion":
        evento = await Actuacion.findById(eventoId);
        break;
      case "Ensayo":
        evento = await Ensayo.findById(eventoId);
        break;
    }

    const esDirectivo =
      (await Directivo.find({
        usuario: payloadId,
        banda: evento.banda,
        fecha_final: undefined,
      }).length) > 0
        ? true
        : false;
    const esArchivero =
      (await Archivero.find({
        usuario: payloadId,
        banda: evento.banda,
        fecha_final: undefined,
      }).length) > 0
        ? true
        : false;
    if (asistencia.length > 0) {
      if (asistencia[0].usuario != payloadId && !esDirectivo && !esArchivero) {
        return res.status(401).json({
          ok: false,
          msg: "No tiene privilegios para realizar esta acción",
        });
      }
      asistencia = asistencia[0];
      res.status(200).json({
        ok: true,
        asistencia,
      });
    } else {
      res.status(200).json({
        ok: true,
        asistencia: undefined,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

/*
 * Obtener todas las asistencias de un evento
 */
const getTodasAsistenciasByEvento = async (req, res = express.response) => {
  try {
    const eventoId = req.params.eventoId;
    const tipo = req.params.tipoEvento;

    let evento;
    switch (tipo) {
      case "Procesion":
        evento = await Procesion.findById(eventoId);
        break;
      case "Actuacion":
        evento = await Actuacion.findById(eventoId);
        break;
      case "Ensayo":
        evento = await Ensayo.findById(eventoId);
        break;
    }

    // Comprobamos que es directivo de la banda o archviero
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;
    let directivos = Directivo.find({
      usuario: payloadId,
      banda: evento.banda,
      fecha_final: undefined,
    });
    let archiveros = Archivero.find({
      usuario: payloadId,
      banda: evento.banda,
      fecha_final: undefined,
    });
    if (directivos.length == 0 && archiveros.length == 0) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegios para realizar esta acción",
      });
    }

    const musicos = await Musico.find({
      banda: evento.banda.toString(),
      fecha_final: undefined,
    });
    directivos = await Directivo.find({
      banda: evento.banda.toString(),
      fecha_final: undefined,
    });
    archiveros = await Archivero.find({
      banda: evento.banda.toString(),
      fecha_final: undefined,
    });
    // Buscamos todas las asistencias
    const asistencias = await Asistencia.find({
      referencia: eventoId,
      tipo: tipo,
    });

    // Creamos un map con eky y clave
    const resultado = {};

    for (let i = 0; i < musicos.length; i++) {
      const musico = musicos[i];
      const instrumento = musico.instrumento + " ";
      const voz = musico.voz;
      const asistencia = asistencias.find(
        (a) => a.usuario.toString() === musico.usuario.toString()
      );
      const usuario = await Usuario.findById(musico.usuario);
      if (resultado[[instrumento, voz]]) {
        const lista = resultado[[instrumento, voz]];
        lista.push([usuario, asistencia]);
        resultado[i[(instrumento, voz)]] = lista;
      } else {
        resultado[[instrumento, voz]] = [[usuario, asistencia]];
      }
    }
    for (let i = 0; i < directivos.length; i++) {
      const directivo = directivos[i];
      const instrumento = directivo.cargo;
      const asistencia = asistencias.find(
        (a) => a.usuario.toString() === directivo.usuario.toString()
      );
      const usuario = await Usuario.findById(directivo.usuario);
      if (resultado[["Directivo: ", instrumento]]) {
        const lista = resultado[["Directivo: ", instrumento]];
        lista.push([usuario, asistencia]);
        resultado[["Directivo: ", instrumento]] = lista;
      } else {
        resultado[["Directivo: ", instrumento]] = [[usuario, asistencia]];
      }
    }
    for (let i = 0; i < archiveros.length; i++) {
      const archivero = archiveros[i];
      const asistencia = asistencias.find(
        (a) => a.usuario.toString() === archivero.usuario.toString()
      );
      const usuario = await Usuario.findById(archivero.usuario);
      if (resultado[["", "Archivero"]]) {
        const lista = resultado[["", "Archivero"]];
        lista.push([usuario, asistencia]);
        resultado[["", "Archivero"]] = lista;
      } else {
        resultado[["", "Archivero"]] = [[usuario, asistencia]];
      }
    }

    res.status(200).json({
      ok: true,
      resultado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

module.exports = {
  crearAsistencia,
  actualizarAsistencia,
  getAsistenciaByUsuarioEventoAndTipo,
  getTodasAsistenciasByEvento,
};
