const express = require('express');
const Archivero = require('../models/Archivero');
const Directivo = require('../models/Directivo');
const jwt = require('jsonwebtoken');


const finalizarArchivero = async(req, res = express.response) => { 
    try {
        const userId = req.params.userId;
        const bandaId = req.params.bandaId;
        const archivero = await Archivero.find({'usuario': userId, 'banda': bandaId, 'fecha_final': undefined});
        if(!archivero) {   
            return res.status(404).json({
                ok: false,
                msg: 'No existe un archivero con ese id'
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

        if(archivero.length === 0) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un archivero con ese id'
            });
        }


        archivero[0].fecha_final = new Date();
        const newArchivero = new Archivero(archivero[0]);
        const archiveroDB = await newArchivero.save();
        
        res.status(201).json({
            ok: true,
            archiveroDB,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });

    }
}

const eliminarArchiveros = async(req, res = express.response) => { 
    const usuarioId = req.params.id;
    try {
        const archivero = await Archivero.deleteMany({'usuario': usuarioId});
        
        
        return res.status(201).json({
            ok: true,
            archivero
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
}

const getArchiveroByUserId = async(req, res = express.response) => {
    try {
        const usuarioId = req.params.id;
        const archivero = await Archivero.find({'usuario': usuarioId});
        return res.status(201).json({
            ok: true,
            archivero
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
    finalizarArchivero,
    eliminarArchiveros,
    getArchiveroByUserId
}