const express = require('express');
const Peticion = require('../models/Peticion');
const Directivo = require('../models/Directivo');
const Musico = require('../models/Musico');
const Archivero = require('../models/Archivero');
const Prestamo = require('../models/Prestamo');
const Banda = require('../models/Banda');
const Vestimenta = require('../models/Vestimenta');
const Instrumento = require('../models/Instrumento');
const Usuario = require('../models/Usuario');
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
            objeto = await Instrumento.findById(prestamo.referencia);
        } else {
            objeto = await Vestimenta.findById(prestamo.referencia);
        }
     
        const directivos = await  Directivo.find({ banda: objeto.banda, usuario: payloadId, fecha_final: undefined });

        if(directivos.length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no es directivo de la banda'
            });
        }
        // Comprobar que el instrumento no esta prestado ya
        const prestamos = await Prestamo.find({ referencia: prestamo.referencia, estado: 'Activo' });
        if(prestamos.length > 0) {
            return res.status(400).json({
                ok: false,
                msg: 'El ' + prestamo.tipo + ' instrumento ya esta prestado'
            });
        }

        const prestamoDB = await prestamo.save();
        const usuario = await Usuario.findById(prestamoDB.usuario);
        prestamoDB.usuario = usuario;
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

const getPrestamoActivoObjeto = async(req, res = express.response) => {
    try {
        const id = req.params.referenciaId;
        const tipo = req.params.tipo;
        //Comprobar que es directivo de la banda
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        let objeto = '';
        if(tipo === 'Instrumento') {
            objeto = await Instrumento.findById(id);
        } else {
            objeto = await Vestimenta.findById(id);
        }
     
        const directivos = await Directivo.find({ banda: objeto.banda, usuario: payloadId, fecha_final: undefined });

        if(directivos.length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no es directivo de la banda'
            });
        }
        const prestamo = await Prestamo.findOne({ referencia: id, estado: 'Activo' });
        
        if(prestamo) {
            const usuario = await Usuario.findById(prestamo.usuario);
            prestamo.usuario = usuario;
        }
        
        res.json({
            ok: true,
            prestamo
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: error
        });
    }
}

const cancelarPrestamo = async(req, res = express.response) => {
    try {
        const id = req.params.id;
        const prestamo = await Prestamo.findById(id);
        if(!prestamo) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe el prestamo'
            });
        }
        prestamo.estado = 'Finalizado';
        prestamo.fechaFinal = Date.now();

        let objeto = null;
        if(prestamo.tipo === 'Instrumento') {
            objeto = await Instrumento.findById(prestamo.referencia);
        } else {
            objeto = await Vestimenta.findById(prestamo.referencia);
        }
        // Comprobamos que es directivo de la banda
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;
        const directivos = await Directivo.find({ banda: objeto.banda, usuario: payloadId, fecha_final: undefined });

        if(directivos.length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no es directivo de la banda'
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

const obtenerPrestamosUsuario = async(req, res = express.response) => {
    try {
        const id = req.params.id;
        // Comprobar que el usuario es el 
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;
        if(payloadId !== id) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no es el mismo que el que hace la peticion'
            });
        }
        const lista = []
        const prestamos = await Prestamo.find({ usuario: id });
        for(let i = 0; i < prestamos.length; i++) {
            const prestamo = prestamos[i];
            let objeto = null;
            if(prestamo.tipo === 'Instrumento') {
                objeto = await Instrumento.findById(prestamo.referencia);
                
                const banda = await Banda.findById(objeto.banda);
                objeto.banda = banda;
            } else {
                objeto = await Vestimenta.findById(prestamo.referencia);
                const banda = await Banda.findById(objeto.banda);
                objeto.banda = banda;
            }
            // creamos diccionario a partir de prestamo
            const newPrestamo = prestamo.toObject();
            newPrestamo.referencia = objeto;
            lista.push(newPrestamo);
        }
        res.json({
            ok: true,
            prestamos: lista
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
    crearPrestamo,
    getPrestamoActivoObjeto,
    cancelarPrestamo,
    obtenerPrestamosUsuario
}