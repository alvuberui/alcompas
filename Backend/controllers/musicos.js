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
        const usuarioId = req.uid;
        const roles_musico = await Musico.find({'usuario': usuarioId});
        condicion = false;
        for(i=0; i < roles_musico.length; i++) {
            rol = roles_musico[i];
            console.log(rol.fecha_final)
            if(!rol.fecha_final) {
                const fecha_final = new Date();
                rol.fecha_final = fecha_final;
                const rolDB = await rol.save();
                
                return res.status(201).json({
                    ok: true,
                    rolDB
                });
            }
        }
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún rol musico sin finalizar'
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