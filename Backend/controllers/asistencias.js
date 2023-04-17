const jwt = require('jsonwebtoken');
const express = require('express');
const Directivo = require('../models/Directivo');
const Asistencia = require('../models/Asistencia');
const Procesion = require('../models/Procesion');
const Actuacion = require('../models/Actuacion');
const Ensayo = require('../models/Ensayo');
const Musico = require('../models/Musico');
const Archivero = require('../models/Archivero');

const perteneceABanda = async(payloadId, asistencia) => {
    // Obtenemos el evento
    let evento;
    switch(asistencia.tipo) {
        case 'Procesion':
            evento = await Procesion.findById(asistencia.referencia);
            break;
        case 'Actuacion':
            evento = await Actuacion.findById(asistencia.referencia);
            break;
        case 'Ensayo':
            evento = await Ensayo.findById(asistencia.referencia);
            break;
    }

    // Comprobar que pertenece a la banda
    const esMusico = (await Musico.find({'usuario': payloadId, 'banda': evento.banda, 'fecha_final': undefined})).length > 0 ? true : false;
    const esDirectivo = (await Directivo.find({'usuario': payloadId, 'banda': evento.banda, 'fecha_final': undefined})).length > 0 ? true : false;
    const esArchivero = (await Archivero.find({'usuario': payloadId, 'banda': evento.banda, 'fecha_final': undefined})).length > 0 ? true : false;

    if(!esMusico && !esDirectivo && !esArchivero) {
        return false;
    } else {
        return true;
    }
}

const esEventoFuturo = async(asistencia) => {
    // Obtenemos el evento
    let evento;
    switch(asistencia.tipo) {
        case 'Procesion':
            evento = await Procesion.findById(asistencia.referencia);
            break;
        case 'Actuacion':
            evento = await Actuacion.findById(asistencia.referencia);
            break;
        case 'Ensayo':
            evento = await Ensayo.findById(asistencia.referencia);
            break;
    }

    // Comprobar que el evento es futuro
    const fechaActual = new Date();
    if(evento.fecha <= fechaActual) {
        return false;
    } else {
        return true;
    }
}

const crearAsistencia = async(req, res = express.response) => {
    try {
        
        const asistencia = new Asistencia(req.body);

        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        const perteneceBanda = await perteneceABanda(payloadId, asistencia);

        if(!perteneceBanda) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para realizar esta acción'
            });
        }

        const esFuturo = await esEventoFuturo(asistencia);

        if(!esFuturo) {
            return res.status(400).json({
                ok: false,
                msg: 'No se puede crear una asistencia a un evento que ya ha pasado'
            });
        }

        // Comprobar que no existe una asistencia con el mismo usuario y banda
        const asistencias = await Asistencia.find({'usuario': payloadId, 'referencia': asistencia.referencia, 'tipo': asistencia.tipo});
        if(asistencias.length > 0) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe una asistencia con el mismo usuario y evento'
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
            msg: 'Error inesperado'
        });
    }
}

const actualizarAsistencia = async(req, res = express.response) => {
    try {
        const asistenciaId = req.params.id;
        const asistencia = new Asistencia(req.body);

        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        const perteneceBanda = await perteneceABanda(payloadId, asistencia);

        if(!perteneceBanda) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para realizar esta acción'
            });
        }

        const esFuturo = await esEventoFuturo(asistencia);

        if(!esFuturo) {
            return res.status(400).json({
                ok: false,
                msg: 'No se puede crear una asistencia a un evento que ya ha pasado'
            });
        }

        asistencia.usuario = payloadId;
        // Actuaizar asistencia

        const asistenciaDB = await Asistencia.findByIdAndUpdate(asistenciaId, asistencia, {new: true});

        res.status(201).json({
            ok: true,
            asistenciaDB,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const getAsistenciaByUsuarioEventoAndTipo = async(req, res = express.response) => {
    try {
        const usuarioId = req.params.usuarioId;
        const eventoId = req.params.eventoId;
        const tipo = req.params.tipoEvento;
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        let asistencia = await Asistencia.find({'usuario': usuarioId, 'referencia': eventoId, 'tipo': tipo});
        
        // Comprobar que el usuario de la asistencia es el mismo del token o que es directivo de la banda
        let evento;
        switch(tipo) {
            case 'Procesion':
                evento = await Procesion.findById(eventoId);
                break;
            case 'Actuacion':
                evento = await Actuacion.findById(eventoId);
                break;
            case 'Ensayo':
                evento = await Ensayo.findById(eventoId);
                break;
        }
        
        const esDirectivo = await Directivo.find({'usuario': payloadId, 'banda': evento.banda, 'fecha_final': undefined}).length > 0 ? true : false;
        const esArchivero = await Archivero.find({'usuario': payloadId, 'banda': evento.banda, 'fecha_final': undefined}).length > 0 ? true : false;
        if(asistencia.length > 0) {
            if((asistencia[0].usuario != payloadId) && !esDirectivo && !esArchivero) {
                return res.status(401).json({
                    ok: false,
                    msg: 'No tiene privilegios para realizar esta acción'
                });
            }
            asistencia = asistencia[0];
            res.status(200).json({
                ok: true,
                asistencia
            });
        } else {
            res.status(200).json({
                ok: true,
                asistencia: undefined
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

module.exports = {
    crearAsistencia,
    actualizarAsistencia,
    getAsistenciaByUsuarioEventoAndTipo
}