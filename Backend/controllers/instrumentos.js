const express = require('express');
const Instrumento = require('../models/Instrumento');

const getInstrumentosByUserId = async(req, res = express.response) => {
    try {
        const userId = req.params.userId;
        const instrumentos = await Instrumento.find({usuario: userId});
        res.json({
            ok: true,
            instrumentos
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }
}

const getinstrumentosById = async(req, res = express.response) => {
    try {
        const instrumentoId = req.params.instrumentoId;
        const instrumento = await Instrumento.findById(instrumentoId)
        res.json({
            ok: true,
            instrumento
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }
}

const crearInstrumentoUsuario = async(req, res = express.response) => {
    try {
        const instrumento = req.body;

        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;


        if(instrumento.usuario != payloadId) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos'
            });
        }


        const nuevoInstrumento = new Instrumento(instrumento);
        const instrumentoGuardado = await nuevoInstrumento.save();
        res.json({
            ok: true,
            instrumentoGuardado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }
}

const eliminarInstrumento = async(req, res = express.response) => {
    try {
        const instrumentoId = req.params.instrumentoId;
        const instrumento = await Instrumento.findById(instrumentoId);
        if(!instrumento) {
            return res.status(404).json({
                ok: false,
                msg: 'Instrumento no encontrado'
            });
        }

        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;


        if(instrumento.usuario != payloadId) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos'
            });
        }

        await Instrumento.findByIdAndDelete(instrumentoId);
        res.json({
            ok: true,
            msg: 'Instrumento eliminado'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }
}

const actualizarInstrumentoUsuario = async(req, res = express.response) => {

    try {
        const instrumentoId = req.params.instrumentoId;
        const instrumento = await Instrumento.findById(instrumentoId);
        if(!instrumento) {
            return res.status(404).json({
                ok: false,
                msg: 'Instrumento no encontrado'
            });
        }

        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;


        if(instrumento.usuario != payloadId) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para crear este instrumento'
            });
        }

        const nuevoInstrumento = {
            ...req.body
        }
        const instrumentoActualizado = await Instrumento.findByIdAndUpdate(instrumentoId, nuevoInstrumento, {new: true});
        res.json({
            ok: true,
            instrumentoActualizado
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
    crearInstrumentoUsuario,
    getInstrumentosByUserId,
    eliminarInstrumento,
    actualizarInstrumentoUsuario,
    getinstrumentosById
}