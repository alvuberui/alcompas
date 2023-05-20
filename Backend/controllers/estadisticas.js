const express = require("express");
const Banda = require("../models/Banda");
const Procesion = require("../models/Procesion");
const Actuacion = require("../models/Actuacion");
const Like = require("../models/Like");

/*
 *  Obtener bandas con mas contratos en semana santa
 */
const getBandasConMasContratosSemanaSanta = async (
  req,
  res = express.response
) => {
  try {
    const bandas = await Banda.find();
    let ordenadas = [];

    for (let i = 0; i < bandas.length; i++) {
      const banda = bandas[i];
      // Obtener numero de procesiones de la banda desde ahora a dentro de un año
      const procesiones = await Procesion.find({
        banda: banda._id,
        tipo: "Semana Santa",
        fechaInicio: {
          $gte: new Date(),
          $lte: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        },
        fechaFin: {
          $gte: new Date(),
          $lte: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        },
      });
      // objeto copia de banda
      const bandaCopia = { ...banda._doc };
      bandaCopia.numero = procesiones.length;
      ordenadas.push(bandaCopia);
    }

    // Ordenar bandas por numero de procesiones de mayor a menor
    ordenadas.sort((a, b) => {
      if (a.numero > b.numero) {
        return -1;
      }
      if (a.numero < b.numero) {
        return 1;
      }
      return 0;
    });

    // Cogemos las 10 primeras
    ordenadas = ordenadas.slice(0, 10);

    res.json({
      ok: true,
      bandas: ordenadas,
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
 *  Obtener bandas con mas contratos
 */
const getBandasConMasContratos = async (req, res = express.response) => {
  try {
    const bandas = await Banda.find();
    let ordenadas = [];

    for (let i = 0; i < bandas.length; i++) {
      const banda = bandas[i];
      // Obtener numero de procesiones de la banda desde ahora a dentro de un año
      const procesiones = await Procesion.find({
        banda: banda._id,
        fechaInicio: {
          $gte: new Date(),
          $lte: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        },
        fechaFin: {
          $gte: new Date(),
          $lte: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        },
      });
      const actuaciones = await Actuacion.find({
        banda: banda._id,
        fechaInicio: {
          $gte: new Date(),
          $lte: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        },
        fechaFin: {
          $gte: new Date(),
          $lte: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        },
      });
      const numero = procesiones.length + actuaciones.length;
      const bandaCopia = { ...banda._doc };
      bandaCopia.numero = numero;
      ordenadas.push(bandaCopia);
    }

    // Ordenar bandas por numero de procesiones de mayor a menor
    ordenadas.sort((a, b) => {
      if (a.numero > b.numero) {
        return -1;
      }
      if (a.numero < b.numero) {
        return 1;
      }
      return 0;
    });

    // Cogemos las 10 primeras
    ordenadas = ordenadas.slice(0, 10);

    res.json({
      ok: true,
      bandas: ordenadas,
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
 *  Obtener bandas populares
 */
const getBandasPopulares = async (req, res = express.response) => {
  try {
    const bandas = await Banda.find();
    let ordenadas = [];

    for (let i = 0; i < bandas.length; i++) {
      const banda = bandas[i];
      // Obtener numero de likes de la banda
      const likes = await Like.find({ referencia: banda._id });

      const bandaCopia = { ...banda._doc };
      bandaCopia.numero = likes.length;
      ordenadas.push(bandaCopia);
    }

    // Ordenar bandas por numero de likes de mayor a menor
    ordenadas.sort((a, b) => {
      if (a.numero > b.numero) {
        return -1;
      }
      if (a.numero < b.numero) {
        return 1;
      }
      return 0;
    });

    // Cogemos las 10 primeras
    ordenadas = ordenadas.slice(0, 10);

    res.json({
      ok: true,
      bandas: ordenadas,
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
  getBandasConMasContratosSemanaSanta,
  getBandasConMasContratos,
  getBandasPopulares,
};
