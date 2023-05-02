const express = require('express');
const Peticion = require('../models/Peticion');
const Directivo = require('../models/Directivo');
const Musico = require('../models/Musico');
const Archivero = require('../models/Archivero');
const Prestamo = require('../models/Prestamo');
const Vestimenta = require('../models/Vestimenta');
const Instrumento = require('../models/Instrumento');
const jwt = require('jsonwebtoken');

const crearPrestamo = async(req, res = express.response) => {
    try {
        const prestamo = new Prestamo(req.body);
        prestamo.fechaInicio = Date.now();
        prestamo.estado = 'Activo';

        // Comprobamos que el que lo crea es un directivo de la banda
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        let objeto = null;
        if(prestamo.tipo === 'Instrumento') {
            objeto = Instrumento.findById(prestamo.referencia);
        } else {
            objeto = Vestimenta.findById(prestamo.referencia);
        }
        const directivos = Directivo.find({ banda: objeto.banda, usuario: payloadId, fecha_final: undefined });

        if(directivos.length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no es directivo de la banda'
            });
        }
        // Comprobar que el instrumento no esta prestado ya
        const prestamos = Prestamo.find({ referencia: prestamo.referencia, estado: 'Activo' });
        if(prestamos.length > 0) {
            return res.status(400).json({
                ok: false,
                msg: 'El ' + prestamo.tipo + ' instrumento ya esta prestado'
            });
        }

        const prestamoDB = await prestamo.save();
        res.json({
            ok: true,
            prestamo: prestamoDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: error
        });
    }
}

module.exports = {
    crearPrestamo
}