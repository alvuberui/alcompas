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
 * Crear una banda
 */
const crearBanda = async (req, res = express.response) => {
  const { telefono, correo, cif } = req.body;

  try {
    let banda = await Banda.findOne({ correo });
    if (banda) {
      return res.status(400).json({
        ok: false,
        msg: "Una banda existe con ese correo",
      });
    }

    banda = await Banda.findOne({ telefono });
    if (banda) {
      return res.status(400).json({
        ok: false,
        msg: "Una banda existe con ese teléfono",
      });
    }

    banda = await Banda.findOne({ cif });
    if (banda) {
      return res.status(400).json({
        ok: false,
        msg: "Una banda existe con ese cif",
      });
    }

    const usuarioId = req.uid;

    banda = new Banda(req.body);
    const nueva_banda = await banda.save();
    const directivo = new Directivo({
      fecha_inicio: new Date(),
      cargo: "Presidente",
      usuario: usuarioId,
      banda: nueva_banda._id,
    });
    const nuevo_directivo = await directivo.save();
    res.status(201).json({
      ok: true,
      nueva_banda,
      nuevo_directivo,
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
 * Actualizar una banda
 */
const actualizar_banda = async (req, res = express.response) => {
  try {
    const bandaId = req.params.id;
    const { telefono, correo, cif } = req.body;

    // Validar que el usuario es directivo de la banda
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;
    let esDirectivo = false;

    const directivos = await Directivo.find({
      usuario: payloadId,
      banda: bandaId,
    });
    for (const directivo of directivos) {
      if (!directivo.fecha_final) {
        esDirectivo = true;
      }
    }

    if (!esDirectivo) {
      return res.status(400).json({
        ok: false,
        msg: "No tiene permisos",
      });
    }

    let banda = await Banda.findById(bandaId);
    if (!banda) {
      return res.status(400).json({
        ok: false,
        msg: "No existe banda",
      });
    }
    banda = await Banda.findOne({ correo });
    if (banda && banda._id != bandaId) {
      return res.status(400).json({
        ok: false,
        msg: "Una banda existe con ese correo",
      });
    }

    banda = await Banda.findOne({ telefono });
    if (banda && banda._id != bandaId) {
      return res.status(400).json({
        ok: false,
        msg: "Una banda existe con ese teléfono",
      });
    }

    banda = await Banda.findOne({ cif });
    if (banda && banda._id != bandaId) {
      return res.status(400).json({
        ok: false,
        msg: "Una banda existe con ese cif",
      });
    }

    const nuevaBanda = {
      ...req.body,
    };
    const bandaActualizada = await Banda.findByIdAndUpdate(
      bandaId,
      nuevaBanda,
      { new: true }
    );

    res.status(201).json({
      ok: true,
      banda: bandaActualizada,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: error.codeName,
    });
  }
};

/*
 * Eliminar una banda
 */
const eliminar_banda = async (req, res = express.response) => {
  try {
    const bandaId = req.params.id;
    const banda = await Banda.findById(bandaId);
    // Validar que el usuario es directivo de la banda
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;
    const usuario = await Usuario.findById(payloadId);

    // Finalizar roles de archiveros, musicos, directivos
    const archiveros = await Archivero.find({ banda: bandaId });
    const musicos = await Musico.find({ banda: bandaId });
    const directivos = await Directivo.find({ banda: bandaId });
    const presidentes = await Directivo.find({
      cargo: "Presidente",
      banda: bandaId,
    });
    let presidente_actual;


    // Comprobar que es el presidente quien quiere eliminar la banda
    for (i = 0; i < presidentes.length; i++) {
      let presidente = presidentes[i];
      if (!presidente.fecha_final && presidente.usuario == payloadId) {
        presidente_actual = presidente;
      }
    }

    if ((presidente_actual == null || presidente_actual.usuario != payloadId) && !usuario.administrador) {
      return res.status(400).json({
        ok: false,
        msg: "No tiene permisos para eliminar la banda",
      });
    }

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

    const banda_eliminada = await Banda.deleteOne(banda);
    res.status(201).json({
      ok: true,
      banda_eliminada,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: error.codeName,
    });
  }
};

/*
 * Obtener todas las bandas de un usuario
 */
const getBandasByUserId = async (req, res = express.response) => {
  try {
    let bandas = [];

    const userId = req.params.userId;

    // Validar que el usuario es directivo de la banda
    const token = req.header("x-token");
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED);
    const payloadId = payload.uid;

    if (userId != payloadId) {
      return res.status(400).json({
        ok: false,
        msg: "Error en servidor",
      });
    }

    const directivos = await Directivo.find({
      usuario: userId,
      fecha_final: null,
    });
    const musicos = await Musico.find({ usuario: userId, fecha_final: null });
    const archiveros = await Archivero.find({
      usuario: userId,
      fecha_final: null,
    });

    for (i = 0; i < directivos.length; i++) {
      let directivo = directivos[i];
      if (!directivo.fecha_final) {
        const banda = await Banda.findById(directivo.banda);
        if (!bandas.some((e) => e.cif === banda.cif)) {
          bandas.push(banda);
        }
      }
    }

    for (i = 0; i < musicos.length; i++) {
      let musico = musicos[i];
      if (!musico.fecha_final) {
        const banda = await Banda.findById(musico.banda);
        if (!bandas.some((e) => e.cif === banda.cif)) {
          bandas.push(banda);
        }
      }
    }
    for (i = 0; i < archiveros.length; i++) {
      let archivero = archiveros[i];
      if (!archivero.fecha_final) {
        const banda = await Banda.findById(archivero.banda);
        if (!bandas.some((e) => e.cif === banda.cif)) {
          bandas.push(banda);
        }
      }
    }

    res.status(201).json({
      ok: true,
      bandas,
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
 * Obtener una banda por su id
 */
const getBandaById = async (req, res = express.response) => {
  try {
    const bandaId = req.params.id;
    const banda = await Banda.findById(bandaId);

    res.status(201).json({
      ok: true,
      banda,
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
 * Obtener todas las bandas
 */
const getBandas = async (req, res = express.response) => {
  try {
    const bandas = await Banda.find();

    res.status(201).json({
      ok: true,
      bandas,
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
 * Obtener todas las bandas cuyo nombre contenga el nombre pasado por parámetro
 */
const getBandasByNombre = async (req, res = express.response) => {
  try {
    const bandas = await Banda.find();
    resultado = [];
    for (i = 0; i < bandas.length; i++) {
      let banda = bandas[i];
      if (
        banda.nombre.toLowerCase().includes(req.params.nombre.toLowerCase())
      ) {
        resultado.push(banda);
      }
    }

    res.status(201).json({
      ok: true,
      resultado,
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
 * Obtener si un usuario pertenece a una banda
 */
const getPerteneceUsuarioBanda = async (req, res = express.response) => {
  try {
    const bandaId = req.params.bandaId;
    const userId = req.params.usuarioId;
    let resultado = false;

    const musicos = await Musico.find({
      usuario: userId,
      banda: bandaId,
      fecha_final: null,
    });

    if (musicos.length > 0) {
      resultado = true;
    } else {
      const directivos = await Directivo.find({
        usuario: userId,
        banda: bandaId,
        fecha_final: null,
      });
      if (directivos.length > 0) {
        resultado = true;
      } else {
        const archiveros = await Archivero.find({
          usuario: userId,
          banda: bandaId,
          fecha_final: null,
        });
        if (archiveros.length > 0) {
          resultado = true;
        }
      }
    }
    res.status(201).json({
      ok: true,
      resultado,
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
 * Obtener todos los componentes de una banda
 */
const getTodosComponentesBanda = async (req, res = express.response) => {
  try {
    const bandaId = req.params.bandaId;
    const musicos = await Musico.find({ banda: bandaId, fecha_final: null });
    const directivos = await Directivo.find({
      banda: bandaId,
      fecha_final: null,
    });
    const archiveros = await Archivero.find({
      banda: bandaId,
      fecha_final: null,
    });
    const componentes = musicos.concat(directivos).concat(archiveros);
    // quitamos aquellos componentes que tienen el mismo usuario
    let componentesSinRepetir = [];
    for (i = 0; i < componentes.length; i++) {
      let componente = componentes[i];
      if (
        !componentesSinRepetir.some(
          (e) => e.usuario.toString() === componente.usuario.toString()
        )
      ) {
        componentesSinRepetir.push(componente);
      }
    }

    let usuarios = [];
    for (i = 0; i < componentesSinRepetir.length; i++) {
      let componente = componentesSinRepetir[i];
      const usuario = await Usuario.findById(componente.usuario);
      usuarios.push(usuario);
    }

    res.status(201).json({
      ok: true,
      componentes: usuarios,
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
  crearBanda,
  actualizar_banda,
  eliminar_banda,
  getBandaById,
  getBandasByUserId,
  getBandas,
  getBandasByNombre,
  getPerteneceUsuarioBanda,
  getTodosComponentesBanda,
};
