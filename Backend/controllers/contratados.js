const express = require('express');
const Transaccion = require('../models/Transaccion');
const Directivo = require('../models/Directivo');
const Musico = require('../models/Musico');
const Contratado = require('../models/Contratado');
const Procesion = require('../models/Procesion');
const Actuacion = require('../models/Actuacion');
const Ensayo = require('../models/Ensayo');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const crearContratado = async(req, res = express.response) => {
    try {
        const transaccionReq = req.body;
        const contratado = new Contratado(transaccionReq);
        const tipoEvento = transaccionReq.tipo;
        let evento;
        switch(tipoEvento) {
            case 'Procesion':
                evento = await Procesion.findById(transaccionReq.referencia);
                break;
            case 'Actuacion':
                evento = await Actuacion.findById(transaccionReq.referencia);
                break;
            case 'Ensayo':
                evento = await Ensayo.findById(transaccionReq.referencia);
                break;
        }

        // Validar que el usuario es directivo de la banda
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;
        
        const rolesDirectivo = await Directivo.find({usuario: payloadId, banda: evento.banda, fechaFin: undefined});
        if(rolesDirectivo.length === 0) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permisos para crear esta transacción'
            });
        }

        const contratadoDB = await contratado.save();

        res.json({
            ok: true,
            contratadoDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const getContratadosByEvento = async(req, res = express.response) => {
    try {
        const tipoEvento = req.params.tipo;
        const referencia = req.params.referencia;
        const contratados = await Contratado.find({tipo: tipoEvento, referencia: referencia});
        const resultados = {};
  
        // Comprobamos que sea directivo de la banda
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;
    
        let evento;
        switch(tipoEvento) {
            case 'Procesion':
                evento = await Procesion.findById(referencia);
                break;
            case 'Actuacion':
                evento = await Actuacion.findById(referencia);
                break;
            case 'Ensayo':
                evento = await Ensayo.findById(referencia);
                break;
        }
        
        const directivos = await Directivo.find({fechaFin: undefined, banda: evento.banda, usuario: payloadId});
        if(directivos.length === 0) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permisos para ver esta información'
            });
        }


        for (i=0; i<contratados.length; i++) {
            let contratado = contratados[i];
            const usuario = await Usuario.findById(contratado.usuario);
            resultados[ [contratado.instrumento, contratado._id ] ] = usuario;
        }

        res.json({
            ok: true,
            resultados
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const eliminarContratado = async(req, res = express.response) => {
    try {
        const id = req.params.id;
        // Comprobamos que sea directivo de la banda
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        const contratado = await Contratado.findById(id);

        let evento;
        switch(contratado.tipo) {
            case 'Procesion':
                evento = await Procesion.findById(contratado.referencia);
                break;
            case 'Actuacion':
                evento = await Actuacion.findById(contratado.referencia);
                break;
            case 'Ensayo':
                evento = await Ensayo.findById(contratado.referencia);
                break;
        }

        const directivos = await Directivo.find({fechaFin: undefined, banda: evento.banda, usuario: payloadId});
        if(directivos.length === 0) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permisos para eliminar esta información'
            });
        }

        const eliminado = await Contratado.findByIdAndDelete(id);
        
        res.json({
            ok: true,
            eliminado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}


module.exports = {
    crearContratado,
    getContratadosByEvento,
    eliminarContratado
}