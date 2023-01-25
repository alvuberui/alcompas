const express = require('express');
const Directivo = require('../models/Directivo');
const Banda = require('../models/Banda');
const jwt = require('jsonwebtoken');


const finalizarDirectivo = async(req, res = express.response) => { 
    try {
        const userId = req.params.userId;
        const bandaId = req.params.bandaId;

        // Validar que el usuario es directivo de la banda
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;
        let condicion = false;

        const ds = await Directivo.find({'usuario': payloadId, 'banda': bandaId, 'fecha_final': undefined});
        for (i=0; i<ds.length; i++) {
            let d = ds[i];
            if(d.usuario === payloadId) {
                condicion = true;
            }
        }
        if(!condicion && payloadId !== userId) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para realizar esta acción'
            });
        }


        const directivo = await Directivo.find({'usuario': userId, 'banda': bandaId, 'fecha_final': undefined});
        
        if(!directivo) {   
            return res.status(404).json({
                ok: false,
                msg: 'No existe un directivo con ese id'
            });
        }
  
        directivo[0].fecha_final = new Date();
        const newDirectivo = new Directivo(directivo[0]);
        const directivoDB = await newDirectivo.save();

        const directivos = await Directivo.find({'banda': bandaId, 'fecha_final': undefined});

        if(directivos.length === 0) {
            await Banda.deleteOne({'_id': bandaId});
        }

        
        res.status(201).json({
            ok: true,
            directivoDB,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });

    }
}

const getDirectivoById = async(req, res = express.response) => { 
    try {
        const directivoId = req.params.id;
        const directivo = await Directivo.findById(directivoId);

        res.status(201).json({
            ok: true,
            directivo
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
}

const getDirectivoByUserId = async(req, res = express.response) => {
    try {
        const usuarioId = req.params.id;
        const directivo = await Directivo.find({'usuario': usuarioId});

        res.status(201).json({
            ok: true,
            directivo
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
}

const getDirectivoByBandaId = async(req, res = express.response) => {

    try {
        const bandaId = req.params.id;
        const directivos = await Directivo.find({'banda': bandaId, 'fecha_final': undefined});

        const diccionario = {};
        for(i=0; i<directivos.length; i++) {
            let directivo = directivos[i];
            if(diccionario[directivo.cargo] == undefined) {
                diccionario[directivo.cargo] = [directivo];
            } else {
                diccionario[directivo.cargo] = [...diccionario[musico.cargo], directivo];
            }
        }
        return res.status(201).json({
            ok: true,
            diccionario
        });
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
}



module.exports = {
    finalizarDirectivo,
    getDirectivoById,
    getDirectivoByUserId,
    getDirectivoByBandaId
}