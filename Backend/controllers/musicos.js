const express = require('express');
const Musico = require('../models/Musico');
const Directivo = require('../models/Directivo');
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
        const musico = await Musico.find({'usuario': userId, 'banda': bandaId, 'fecha_final': undefined});
        if(!musico) {   
            return res.status(404).json({
                ok: false,
                msg: 'No existe un músico con ese id'
            });
        }
        
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;
        let condicion = false;
        let condicion2 = false;

        if(payloadId === userId) {
            condicion2 = true;
        }

        const ds = await Directivo.find({'usuario': payloadId, 'banda': bandaId, 'fecha_final': undefined});
        for (i=0; i<ds.length; i++) {
            let d = ds[i];
            if(d.usuario === payloadId) {
                condicion = true;
            }
        }
        if( condicion === false && condicion2 === false) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para realizar esta acción'
            });
        }


        musico[0].fecha_final = new Date();
        const newMusico = new Musico(musico[0]);
        const musicoDB = await newMusico.save();
        
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
    
    try {
        const usuarioId = req.params.id;
       

        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;
        const u = await Usuario.findById(payloadId);

        if(u.administrador === false || payloadId !== usuarioId) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para realizar esta acción'
            });
        }

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

const getMusicosByBandaId = async(req, res = express.response) => {

    try {
        const bandaId = req.params.bandaId;
        const musicos = await Musico.find({'banda': bandaId, fecha_final: undefined});
        const diccionario = {};
        for(i=0; i<musicos.length; i++) {
            let musico = musicos[i];
            if(diccionario[musico.instrumento] == undefined) {
                diccionario[musico.instrumento] = [musico];
            } else {
                diccionario[musico.instrumento] = [...diccionario[musico.instrumento], musico];
            }
        }
        return res.status(201).json({
            ok: true,
            diccionario
        });
    } catch(error) {
      
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
}

const getMusicoById = async(req, res = express.response) => {
    try {
        const musicoId = req.params.musicoId;
        const musico = await Musico.findById(musicoId);
        return res.status(201).json({
            ok: true,
            musico
        });
    } catch(error) {
       
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
}

const getMusicosByUserId = async(req, res = express.response) => {
    try {
        const userId = req.params.userId;
        const musicos = await Musico.find({'usuario': userId});
        return res.status(201).json({
            ok: true,
            musicos
        });
    } catch(error) {
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
    getMusicosByBandaId,
    getMusicoById,
    getMusicosByUserId
}