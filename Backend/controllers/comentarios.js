const express = require('express');
const Comentario = require('../models/Comentario');
const jwt = require('jsonwebtoken');

const getComentarioByBandaId = async(req, res = express.response) => {
    
    try {
        const bandaId = req.params.bandaId;
        const comentarios = await Comentario.find({'banda': bandaId});
        res.json({
            ok: true,
            comentarios
        });
    } catch (error) {
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }
    
}

const crearComentario = async(req, res = express.response) => {
    try {
        
        const  comentario = new Comentario(req.body);
        comentario.fecha = new Date();
        const nuevoComentario = await comentario.save();

        res.json({
            ok: true,
            nuevoComentario
        });

    } catch (error) {
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }
}

const eliminarComentario = async(req, res = express.response) => {

    try {
        const c= req.params.comentarioId;
        const comentario = await Comentario.findById(req.params.comentarioId);
        // Validar que el usuario es directivo de la banda
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        if(comentario.usuario != payloadId) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para eliminar este comentario'
            });
        }

        
        await comentario.remove();
        res.json({
            ok: true,
            msg: 'Comentario eliminado',
            comentario
        });
    } catch (error) {
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }
}






module.exports = {
    getComentarioByBandaId,
    crearComentario,
    eliminarComentario
}