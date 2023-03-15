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

module.exports = {
    crearTransaccion,
}