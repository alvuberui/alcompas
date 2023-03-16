const express = require('express');
const Transaccion = require('../models/Transaccion');
const Directivo = require('../models/Directivo');
const Musico = require('../models/Musico');
const Archivero = require('../models/Archivero');
const jwt = require('jsonwebtoken');

/*
* Crea una transaccion a partir de los datos recibidos en el body
*/
const crearTransaccion = async(req, res = express.response) => {
    
    try {
        const transaccionReq = req.body;
        const transaccion = new Transaccion(transaccionReq);

        // Validar que el usuario es tesorero de la banda
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        const rolesDirectivo = await Directivo.find({usuario: payloadId, banda: transaccion.banda});
        let esTesorero = false;

        for(let i = 0; i < rolesDirectivo.length; i++) {
            const rol = rolesDirectivo[i];
            if(!rol.fechaFin && rol.cargo === 'Tesorero') {
                esTesorero = true;
                break;
            }
        }
        if(!esTesorero) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permisos para crear esta transacción'
            });
        }

        const transaccionDB = await transaccion.save();
    
        res.json({
            ok: true,
            transaccionDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }
}

const getByBanda = async(req, res = express.response) => {
    try {
        const bandaId = req.params.bandaId;
        // Comprobar que el usuario es directivo
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;
        const rolesDirectivo = await Directivo.find({usuario: payloadId, banda: bandaId});
        let esDirectivo = false;

        for(let i = 0; i < rolesDirectivo.length; i++) {
            const rol = rolesDirectivo[i];
            if(!rol.fechaFin) {
                esDirectivo = true;
                break;
            }
        }
        if(!esDirectivo) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permisos para realizar esta operación'
            });
        }

        const transacciones = await Transaccion.find({banda: bandaId}).sort({fecha: 1});
        res.json({
            ok: true,
            transacciones
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const actualizarTransaccion = async(req, res = express.response) => {
    try {
        const transaccionReq = req.body;
        const transaccionId = req.params.transaccionId;

        // Validar que el usuario es tesorero de la banda
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        const rolesDirectivo = await Directivo.find({usuario: payloadId, banda: transaccionReq.banda});
        let esTesorero = false;

        for(let i = 0; i < rolesDirectivo.length; i++) {
            const rol = rolesDirectivo[i];
            if(!rol.fechaFin && rol.cargo === 'Tesorero') {
                esTesorero = true;
                break;
            }
        }
        if(!esTesorero) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permisos para crear esta transacción'
            });
        }

    
        const transaccionDB = await Transaccion.findByIdAndUpdate(transaccionId, transaccionReq, {new: true});
    
        res.json({
            ok: true,
            transaccionDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }
}

const deleteById = async(req, res = express.response) => {
    try {
        const transaccionId = req.params.transaccionId;
        const transaccionReq = await Transaccion.findById(transaccionId);

        // Validar que el usuario es tesorero de la banda
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;
  
        const rolesDirectivo = await Directivo.find({usuario: payloadId, banda: transaccionReq.banda});
        let esTesorero = false;

        for(let i = 0; i < rolesDirectivo.length; i++) {
            const rol = rolesDirectivo[i];
     
            if(!rol.fechaFin && rol.cargo === 'Tesorero') {
                esTesorero = true;
                break;
            }
        }
        if(!esTesorero) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permisos para crear esta transacción'
            });
        }

    
        await Transaccion.findByIdAndDelete(transaccionId);
    
        res.json({
            ok: true,
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
    crearTransaccion,
    getByBanda,
    actualizarTransaccion,
    deleteById
}