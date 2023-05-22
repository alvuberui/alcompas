const express = require("express");
const Procesion = require("../models/Procesion");
const Directivo = require("../models/Directivo");
const Transaccion = require("../models/Transaccion");
const Actuacion = require("../models/Actuacion");
const Ensayo = require("../models/Ensayo");
const Like = require("../models/Like");
const jwt = require("jsonwebtoken");
const Contratado = require("../models/Contratado");
const Asistencia = require("../models/Asistencia");
const Archivero = require("../models/Archivero");
const Musico = require("../models/Musico");

// Controladores sobre procesiones

/*
 *  Obtener procesiones por banda
 */
const crearProcesion = async (req, res = express.response) => {
  try {
    const procesion = new Procesion(req.body);

    // Validar que el usuario es directivo de la banda
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    // Comprobar que el directivo pertenece a la banda
    const directivos = await  Directivo.find({
      usuario: payloadId,
      banda: procesion.banda,
      fecha_final: undefined,
    });
    if (directivos.length == 0) {
      return res.status(400).json({
        ok: false,
        msg: "No tiene permisos para crear esta procesión",
      });
    }

    // Comprobar que todas las fechas son válidas
    if (procesion.fechaFin <= procesion.fechaInicio) {
      return res.status(400).json({
        ok: false,
        msg: "La fecha de finalización debe ser mayor a la fecha de inicio",
      });
    }

    if (procesion.fechaInicio < procesion.fechaSalida) {
      return res.status(400).json({
        ok: false,
        msg: "La fecha de salida debe ser menos que la fecha de inicio",
      });
    }
    // Crear transacción
    let transaccion = {};
    const cantidad = procesion.beneficios - procesion.costes;
    if (cantidad > 0) {
      transaccion = new Transaccion({
        cantidad: cantidad,
        motivo: procesion.titulo,
        descripcion:
          "Beneficios: " +
          procesion.beneficios +
          " - Costes: " +
          procesion.costes +
          " = " +
          cantidad +
          "€" +
          " - " +
          procesion.comentarioEconomico,
        fecha: procesion.fechaSalida,
        tipo: "Beneficio",
        banda: procesion.banda,
      });
    } else {
      transaccion = new Transaccion({
        cantidad: cantidad,
        motivo: procesion.titulo,
        descripcion:
          "Beneficios: " +
          procesion.beneficios +
          " - Costes: " +
          procesion.costes +
          " = -" +
          cantidad +
          "€" +
          " - " +
          procesion.comentarioEconomico,
        fecha: procesion.fechaSalida,
        tipo: "Gasto",
        banda: procesion.banda,
      });
    }
    const transaccionDB = await transaccion.save();
    procesion.transaccion = transaccionDB._id;
    const procesionDB = await procesion.save();

    res.json({
      ok: true,
      procesionDB,
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
 *  Actualizar procesión
 */
const actualizarProcesion = async (req, res = express.response) => {
  try {
    const procesion = new Procesion(req.body);

    const procesionId = req.params.id;
    // Validar que el usuario es directivo de la banda
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    // Comprobar que el directivo pertenece a la banda
    const directivos = await Directivo.find({
      usuario: payloadId,
      banda: procesion.banda,
      fecha_final: undefined,
    });
    if (directivos.length == 0) {
      return res.status(400).json({
        ok: false,
        msg: "No tiene permisos para crear esta procesión",
      });
    }

    // Comprobar que todas las fechas son válidas
    if (procesion.fechaFin <= procesion.fechaInicio) {
      return res.status(400).json({
        ok: false,
        msg: "La fecha de finalización debe ser mayor a la fecha de inicio",
      });
    }

    if (procesion.fechaInicio < procesion.fechaSalida) {
      return res.status(400).json({
        ok: false,
        msg: "La fecha de salida debe ser menos que la fecha de inicio",
      });
    }
    // Actualizar transacción

    const cantidad = procesion.beneficios - procesion.costes;
    if (cantidad > 0) {
      const nuevaTransaccion = new Transaccion({
        cantidad: cantidad,
        motivo: procesion.titulo,
        descripcion:
          "Beneficios: " +
          procesion.beneficios +
          " - Costes: " +
          procesion.costes +
          " = " +
          cantidad +
          "€" +
          " - " +
          procesion.comentarioEconomico,
        fecha: procesion.fechaSalida,
        tipo: "Beneficio",
        banda: procesion.banda,
      });
      nuevaTransaccion._id = procesion.transaccion;
      await Transaccion.findByIdAndUpdate(
        procesion.transaccion.toString(),
        nuevaTransaccion
      );
    } else {
      const nuevaTransaccion = new Transaccion({
        cantidad: cantidad,
        motivo: procesion.titulo,
        descripcion:
          "Beneficios: " +
          procesion.beneficios +
          " - Costes: " +
          procesion.costes +
          " = -" +
          cantidad +
          "€" +
          " - " +
          procesion.comentarioEconomico,
        fecha: procesion.fechaSalida,
        tipo: "Gasto",
        banda: procesion.banda,
      });
      nuevaTransaccion._id = procesion.transaccion;
      await Transaccion.findByIdAndUpdate(
        procesion.transaccion.toString(),
        nuevaTransaccion
      );
    }

    const procesionDB = await Procesion.findByIdAndUpdate(
      procesionId,
      procesion,
      { new: true }
    );

    res.json({
      ok: true,
      procesionDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

// Controladores sobre actuaciones

/*
 *  Obtener actuaciones por banda
 */
const crearActuacion = async (req, res = express.response) => {
  try {
    const actuacion = new Actuacion(req.body);

    // Validar que el usuario es directivo de la banda
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    // Comprobar que el directivo pertenece a la banda
    const directivos = await Directivo.find({
      usuario: payloadId,
      banda: actuacion.banda,
      fecha_final: undefined,
    });
    if (directivos.length == 0) {
      return res.status(400).json({
        ok: false,
        msg: "No tiene permisos para crear esta procesión",
      });
    }

    // Comprobar que todas las fechas son válidas
    if (actuacion.fechaFin <= actuacion.fechaInicio) {
      return res.status(400).json({
        ok: false,
        msg: "La fecha de finalización debe ser mayor a la fecha de inicio",
      });
    }
    if (actuacion.fechaInicio < actuacion.fechaSalida) {
      return res.status(400).json({
        ok: false,
        msg: "La fecha de salida debe ser menos que la fecha de inicio",
      });
    }

    // Crear transacción
    let transaccion = {};
    const cantidad = actuacion.beneficios - actuacion.costes;
    if (cantidad > 0) {
      transaccion =  new Transaccion({
        cantidad: cantidad,
        motivo: actuacion.titulo,
        descripcion:
          "Beneficios: " +
          actuacion.beneficios +
          " - Costes: " +
          actuacion.costes +
          " = " +
          cantidad +
          "€" +
          " - " +
          actuacion.comentarioEconomico,
        fecha: actuacion.fechaSalida,
        tipo: "Beneficio",
        banda: actuacion.banda,
      });
    } else {
      transaccion =  new Transaccion({
        cantidad: cantidad,
        motivo: actuacion.titulo,
        descripcion:
          "Beneficios: " +
          actuacion.beneficios +
          " - Costes: " +
          actuacion.costes +
          " = -" +
          cantidad +
          "€" +
          " - " +
          actuacion.comentarioEconomico,
        fecha: actuacion.fechaSalida,
        tipo: "Gasto",
        banda: actuacion.banda,
      });
    }
    const transaccionDB = await transaccion.save();
    actuacion.transaccion = transaccionDB._id;
    const actuacionDB = await actuacion.save();

    res.json({
      ok: true,
      actuacionDB,
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
 *  Actualizar actuación
 */
const actualizarActuacion = async (req, res = express.response) => {
  try {
    const actuacion = new Procesion(req.body);
    const actuacionId = req.params.id;
    // Validar que el usuario es directivo de la banda
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    // Comprobar que el directivo pertenece a la banda
    const directivos = await Directivo.find({
      usuario: payloadId,
      banda: actuacion.banda,
      fecha_final: undefined,
    });
    if (directivos.length == 0) {
      return res.status(400).json({
        ok: false,
        msg: "No tiene permisos para crear esta procesión",
      });
    }

    // Comprobar que todas las fechas son válidas
    if (actuacion.fechaFin <= actuacion.fechaInicio) {
      return res.status(400).json({
        ok: false,
        msg: "La fecha de finalización debe ser mayor a la fecha de inicio",
      });
    }

    if (actuacion.fechaInicio < actuacion.fechaSalida) {
      return res.status(400).json({
        ok: false,
        msg: "La fecha de salida debe ser menos que la fecha de inicio",
      });
    }
    // Actualizar transacción
    let transaccion = {};
    const cantidad = actuacion.beneficios - actuacion.costes;
    if (cantidad > 0) {
      transaccion = new Transaccion({
        cantidad: cantidad,
        motivo: actuacion.titulo,
        descripcion:
          "Beneficios: " +
          actuacion.beneficios +
          " - Costes: " +
          actuacion.costes +
          " = " +
          cantidad +
          "€" +
          " - " +
          actuacion.comentarioEconomico,
        fecha: actuacion.fechaSalida,
        tipo: "Beneficio",
        banda: actuacion.banda,
      });
      transaccion._id = actuacion.transaccion;
      await Transaccion.findByIdAndUpdate(actuacion.transaccion, transaccion, { new: true });
    } else {
      transaccion = new Transaccion({
        cantidad: cantidad,
        motivo: actuacion.titulo,
        descripcion:
          "Beneficios: " +
          actuacion.beneficios +
          " - Costes: " +
          actuacion.costes +
          " = -" +
          cantidad +
          "€" +
          " - " +
          actuacion.comentarioEconomico,
        fecha: actuacion.fechaSalida,
        tipo: "Gasto",
        banda: actuacion.banda,
      });
      transaccion._id = actuacion.transaccion;
      await Transaccion.findByIdAndUpdate(actuacion.transaccion, transaccion);
    }
    const actuacionDB = await Actuacion.findByIdAndUpdate(
      actuacionId,
      actuacion,
      { new: true }
    );

    res.json({
      ok: true,
      actuacionDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

// Controladores sobre ensayos
/*
 *  Obtener ensayos por banda
 */
const crearEnsayo = async (req, res = express.response) => {
  try {
    const ensayo = new Ensayo(req.body);

    // Validar que el usuario es directivo de la banda
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    // Comprobar que el directivo pertenece a la banda
    const directivos = await Directivo.find({
      usuario: payloadId,
      banda: ensayo.banda,
      fecha_final: undefined,
    });
    if (directivos.length == 0) {
      return res.status(400).json({
        ok: false,
        msg: "No tiene permisos para crear esta procesión",
      });
    }

    // Comprobar que todas las fechas son válidas
    if (ensayo.fechaFin <= ensayo.fechaInicio) {
      return res.status(400).json({
        ok: false,
        msg: "La fecha de finalización debe ser mayor a la fecha de inicio",
      });
    }
    const ensayoDB = await ensayo.save();

    res.json({
      ok: true,
      ensayoDB,
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
 *  Actualizar ensayo
 */
const actualizarEnsayo = async (req, res = express.response) => {
  try {
    const ensayo = new Ensayo(req.body);

    const ensayoId = req.params.id;
    // Validar que el usuario es directivo de la banda
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    // Comprobar que el directivo pertenece a la banda
    const directivos = await Directivo.find({
      usuario: payloadId,
      banda: ensayo.banda,
      fecha_final: undefined,
    });
    if (directivos.length == 0) {
      return res.status(400).json({
        ok: false,
        msg: "No tiene permisos para crear esta procesión",
      });
    }

    // Comprobar que todas las fechas son válidas
    if (ensayo.fechaFin <= ensayo.fechaInicio) {
      return res.status(400).json({
        ok: false,
        msg: "La fecha de finalización debe ser mayor a la fecha de inicio",
      });
    }

    const ensayoDB = await Ensayo.findByIdAndUpdate(ensayoId, ensayo, { new: true });

    res.json({
      ok: true,
      ensayoDB,
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
 *  Obtener eventos por banda
 */
const getDestacados = async (req, res = express.response) => {
  try {
    let eventos = [];
    let fecha = req.body.fecha;
    const dia = new Date(fecha).getDate();
    fecha = new Date(fecha).setHours(0, 0, 0, 0);
    const procesiones = await Procesion.find({
      fechaInicio: { $gte: fecha, $lt: new Date(fecha).setDate(dia + 1) },
    });
    const actuaciones = await Actuacion.find({
      fechaInicio: { $gte: fecha, $lt: new Date(fecha).setDate(dia + 1) },
    });
    const diccionario = new Map();
    eventos = [...procesiones, ...actuaciones];

    // Buscamos el numero de mg de cada una
    for (let i = 0; i < eventos.length; i++) {
      const evento = eventos[i];
      const likes = await Like.find({ referencia: evento._id });
      diccionario.set(evento, likes.length);
    }
    // Ordenamos el diccionario
    const sorted = new Map(
      [...diccionario.entries()].sort((a, b) => b[1] - a[1])
    );
    // Obtenemos las claves
    const keys = [...sorted.keys()];
    // Obtenemos los 7 primeros
    eventos = keys.slice(0, 7);

    res.json({
      ok: true,
      eventos,
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
 *  Obtener eventos por banda
 */
const getEventosBandaFecha = async (req, res = express.response) => {
  try {
    let eventos = [];
    let fecha = req.body.fecha;
    const banda = req.body.banda;
    const dia = new Date(fecha).getDate();
    fecha = new Date(fecha).setHours(0, 0, 0, 0);

    // Obtenemos token
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    // Comprobamos si pertenece a la banda
    const directivos = await Directivo.find({
      usuario: payloadId,
      banda: banda,
      fecha_final: undefined,
    });
    const archiveros = await Archivero.find({
      usuario: payloadId,
      banda: banda,
      fecha_final: undefined,
    });
    const musicos = await Musico.find({
      usuario: payloadId,
      banda: banda,
      fecha_final: undefined,
    });

    let procesiones = [];
    let actuaciones = [];
    let ensayos = [];

    if (
      directivos.length == 0 &&
      archiveros.length == 0 &&
      musicos.length == 0
    ) {
      procesiones = await Procesion.find({
        banda: banda,
        fechaInicio: { $gte: fecha, $lt: new Date(fecha).setDate(dia + 1) },
      });
      actuaciones = await Actuacion.find({
        banda: banda,
        fechaInicio: { $gte: fecha, $lt: new Date(fecha).setDate(dia + 1) },
      });
    } else {
      procesiones = await Procesion.find({
        banda: banda,
        fechaInicio: { $gte: fecha, $lt: new Date(fecha).setDate(dia + 1) },
      });
      actuaciones = await Actuacion.find({
        banda: banda,
        fechaInicio: { $gte: fecha, $lt: new Date(fecha).setDate(dia + 1) },
      });
      ensayos = await Ensayo.find({
        banda: banda,
        fechaInicio: { $gte: fecha, $lt: new Date(fecha).setDate(dia + 1) },
      });
    }
    eventos = [...procesiones, ...actuaciones, ...ensayos];

    res.json({
      ok: true,
      eventos,
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
 *  Obtener eventos por banda
 */
const getByTipoId = async (req, res = express.response) => {
  try {
    const tipo = req.params.tipo;
    const id = req.params.id;

    if (tipo === "Procesión") {
      const evento = await Procesion.findById(id);
      return res.json({
        ok: true,
        evento,
      });
    } else if (tipo === "Actuación") {
      const evento = await Actuacion.findById(id);
      return res.json({
        ok: true,
        evento,
      });
    } else {
      const evento = await Ensayo.findById(id);
      return res.json({
        ok: true,
        evento,
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
 *  Obtener eventos por banda
 */
const eliminarEvento = async (req, res = express.response) => {
  try {
    const tipo = req.params.tipo;
    const id = req.params.id;
    let evento = undefined;

    //Comprobamos si es directivo
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;


    if (tipo === "Procesión") {
      evento = await Procesion.findById(id);
      const directivos = await Directivo.find({
        usuario: payloadId,
        banda: evento.banda,
        fecha_final: undefined,
      });
      if (directivos.length == 0) {
        return res.status(400).json({
          ok: false,
          msg: "No tiene permisos para eliminar esta procesión",
        });
      }
      await Procesion.findByIdAndDelete(id);
      await Transaccion.findByIdAndDelete(evento.transaccion);
    } else if (tipo === "Actuación") {
      evento = await Actuacion.findById(id);
      const directivos = await Directivo.find({
        usuario: payloadId,
        banda: evento.banda,
        fecha_final: undefined,
      });
      if (directivos.length == 0) {
        return res.status(400).json({
          ok: false,
          msg: "No tiene permisos para eliminar esta procesión",
        });
      }
      await Actuacion.findByIdAndDelete(id);
      await Transaccion.findByIdAndDelete(evento.transaccion);
    } else {
      evento = await Ensayo.findById(id);
      const directivos = await Directivo.find({
        usuario: payloadId,
        banda: evento.banda,
        fecha_final: undefined,
      });
      if (directivos.length == 0) {
        return res.status(400).json({
          ok: false,
          msg: "No tiene permisos para eliminar esta procesión",
        });
      }
      evento = await Ensayo.findByIdAndDelete(id);
    }



    await Contratado.deleteMany({ evento: id });
    await Asistencia.deleteMany({ evento: id });
    await Like.deleteMany({ referencia: id });
    res.json({
      ok: true,
      evento,
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
  crearProcesion,
  crearActuacion,
  crearEnsayo,
  getDestacados,
  getEventosBandaFecha,
  actualizarProcesion,
  actualizarActuacion,
  actualizarEnsayo,
  getByTipoId,
  eliminarEvento,
};
