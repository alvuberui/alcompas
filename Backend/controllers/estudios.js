const express = require('express');
const Estudio = require('../models/Estudio');
const jwt = require('jsonwebtoken');

const getEstudiosByUserId = async(req, res = express.response) => {
    const userId = req.params.userId;
    try {
        const estudios = await Estudio.find({usuario: userId});
        res.json({
            ok: true,
            estudios
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const crearEstudio = async(req, res = express.response) => {
    
    try {
        const estudio = new Estudio(req.body);

        // Validar que el usuario es directivo de la banda
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;


        if(estudio.usuario != payloadId) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para crear este estudio'
            });
        }

        if(estudio.fechaFin <= estudio.fechaInicio) {
            return res.status(400).json({
                ok: false,
                msg: 'La fecha de finalización debe ser mayor a la fecha de inicio'
            });
        }

        await estudio.save();
    
        res.json({
            ok: true,
            estudio
        });
    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }
}

const eliminarEstudioById   = async(req, res = express.response) => {
   
    try {
        const estudioId = req.params.estudioId;
        const estudio = await Estudio.findByIdAndDelete(estudioId);

        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;


        if(estudio.usuario != payloadId) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para crear este estudio'
            });
        }

        res.json({
            ok: true,
            estudio
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const editarEstudio = async(req, res = express.response) => {
    try {
        const estudioId = req.params.estudioId;
        const estudio = await Estudio.findById(estudioId);

        if(!estudio) {
            return res.status(404).json({
                ok: false,
                msg: 'Estudio no encontrado'
            });
        }

        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;


        if(estudio.usuario != payloadId) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para editar este estudio'
            });
        }

        const nuevoEstudio = {
            ...req.body
        }

        if(nuevoEstudio.fechaFin <= nuevoEstudio.fechaInicio) {
            return res.status(400).json({
                ok: false,
                msg: 'La fecha de finalización debe ser mayor a la fecha de inicio'
            });
        }

        const estudioActualizado = await Estudio.findByIdAndUpdate(estudioId, nuevoEstudio, {new: true});
        res.json({
            ok: true,
            estudioActualizado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }
}

const getEstudioById = async(req, res = express.response) => {  
    const estudioId = req.params.estudioId;
    try {
        const estudio = await Estudio.findById(estudioId);
        if(!estudio) {
            return res.status(404).json({
                ok: false,
                msg: 'Estudio no encontrado'
            });
        }
        res.json({
            ok: true,
            estudio
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
    crearEstudio,
    getEstudiosByUserId,
    eliminarEstudioById,
    editarEstudio,
    getEstudioById
    
}