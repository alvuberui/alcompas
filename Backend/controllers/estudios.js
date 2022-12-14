const express = require('express');
const Estudio = require('../models/Estudio');
const Usuario = require('../models/Usuario');
const { calcularDuracionEnDias } = require('../middlewares/calcularDuracion');

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
        const fechaInicio = estudio.fechaInicio;
        const fechaFin = estudio.fechaFin;
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
    const estudioId = req.params.estudioId;
    try {
        const estudio = await Estudio.findByIdAndDelete(estudioId);
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
        const nuevoEstudio = {
            ...req.body
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