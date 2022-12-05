const express = require('express');
const Instrumento = require('../models/Instrumento');
const Usuario = require('../models/Usuario');



const crearInstrumentoUsuario = async(req, res = express.response) => {
    try {
        const instrumento = req.body

        const nuevoInstrumento = new Instrumento(instrumento);
        console.log(nuevoInstrumento);
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





module.exports = {
    crearInstrumentoUsuario,

}