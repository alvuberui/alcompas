const express = require('express');
const Musico = require('../models/Musico');

const crearMusico = async(req, res = express.response) => {
    try {
        const usuarioId = req.uid;

        const roles_musicos = await Musico.find({'usuario': usuarioId});
        
        for (i=0; i<roles_musicos.length; i++) {
            let rol = roles_musicos[i];
            if(rol.fecha_final == undefined) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya tiene el rol de músico actualmente'
                });
            }
        }

        let musicoNuevo = new Musico(req.body);
        musicoNuevo.usuario = req.uid;
        const musicoDB = await musicoNuevo.save();

        res.status(201).json({
            ok: true,
            musicoDB,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
}

const finalizarMusico = async(req, res = express.response) => { 
    try {
        const userId = req.params.userId;
        const bandaId = req.params.bandaId;
        const musico = await Musico.find({'usuario': userId, 'banda': bandaId});

        if(!musico) {   
            return res.status(404).json({
                ok: false,
                msg: 'No existe un músico con ese id'
            });
        }

        musico.fecha_final = new Date();
        const musicoDB = await musico.save();
        
        res.status(201).json({
            ok: true,
            musicoDB,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });

    }
}

const eliminarMusicos = async(req, res = express.response) => { 
    const usuarioId = req.params.id;
    try {
        const musico = await Musico.deleteMany({'usuario': usuarioId});
        
        
        return res.status(201).json({
            ok: true,
            musico
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
}


module.exports = {
    crearMusico,
    finalizarMusico,
    eliminarMusicos,
}