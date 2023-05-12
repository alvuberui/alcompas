const express = require('express');
const Musico = require('../models/Musico');
const Directivo = require('../models/Directivo');
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');


const finalizarMusico = async(req, res = express.response) => { 
    try {
        const userId = req.params.userId;
        const bandaId = req.params.bandaId;
        const musico = await Musico.find({'usuario': userId, 'banda': bandaId, 'fecha_final': undefined});
        if(musico.length === 0 ) {   
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
        if(ds.length > 0) {
            condicion = true;
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

const getMusicosByIntrumentoAndLocalidad = async(req, res = express.response) => {
    try {
        const instrumento = req.params.instrumento;
        const localidad = req.params.localidad;
        
        const musicos = await Musico.find({'instrumento': instrumento});
        const musicosFiltrados = [];

        // Comprobamos que es directivo de alguna banda
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        const ds = await Directivo.find({'usuario': payloadId, 'fecha_final': undefined});
        if(ds.length === 0) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para realizar esta acción'
            });
        }
        
        for(i=0; i<musicos.length; i++) {
            let musico = musicos[i];
            const usuario = await Usuario.findById(musico.usuario);
            if(usuario.localidad !== localidad) {
                continue;
            }
            musicosFiltrados.push(musico);
        }
        return res.status(201).json({
            ok: true,
            musicosFiltrados
        });
    } catch(error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
}

const esMusicoByBandaId = async(req, res = express.response) => {
    try {
        const bandaId = req.params.bandaId;
        // usuario atravez token
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;
        const musicos = await Musico.find({'usuario': payloadId, 'banda': bandaId, 'fecha_final': undefined});
        let esMusico = false;
        if(musicos.length > 0) {
            esMusico = true;
        }
        res.status(200).json({
            ok: true,
            esMusico
        });
    } catch(error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
}




module.exports = {
    finalizarMusico,
    getMusicosByBandaId,
    getMusicoById,
    getMusicosByUserId,
    getMusicosByIntrumentoAndLocalidad,
    esMusicoByBandaId
}