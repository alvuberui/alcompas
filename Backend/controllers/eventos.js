const express = require('express');
const Procesion = require('../models/Procesion');
const Directivo = require('../models/Directivo');
const Transaccion = require('../models/Transaccion');
const Actuacion = require('../models/Actuacion');
const Ensayo = require('../models/Ensayo');
const jwt = require('jsonwebtoken');

const crearProcesion = async(req, res = express.response) => {
    try {
        const procesion = new Procesion(req.body);

        // Validar que el usuario es directivo de la banda
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;
        
        // Comprobar que el directivo pertenece a la banda
        const directivos = Directivo.find({usuario: payloadId, banda: procesion.banda, fecha_final: undefined});
        if(directivos.length == 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para crear esta procesión'
            });
        }

        // Comprobar que todas las fechas son válidas
        if(procesion.fechaFin <= procesion.fechaInicio) {
            return res.status(400).json({
                ok: false,
                msg: 'La fecha de finalización debe ser mayor a la fecha de inicio'
            });
        }

        if(procesion.fechaInicio < procesion.fechaSalida) {
            return res.status(400).json({
                ok: false,
                msg: 'La fecha de salida debe ser menos que la fecha de inicio'
            });
        }

        
        

        // Crear transacción
        let transaccion = {};
        const cantidad = procesion.beneficios - procesion.costes;
        if (cantidad > 0) {
             transaccion = new Transaccion({ "cantidad": cantidad, "motivo": procesion.titulo , "descripcion": "Beneficios: " + procesion.beneficios + " - Costes: " + procesion.costes + " = " + cantidad + "€" + " - " + procesion.comentarioEconomico,
              "fecha": procesion.fechaSalida,  "tipo": "Beneficio", "banda": procesion.banda });
        } else  {
            transaccion = new Transaccion({ "cantidad": cantidad, "motivo": procesion.titulo , "descripcion": "Beneficios: " + procesion.beneficios + " - Costes: " + procesion.costes + " = -" + cantidad + "€" + " - " + procesion.comentarioEconomico,
            "fecha": procesion.fechaSalida,  "tipo": "Gasto", "banda": procesion.banda });
        }
        const transaccionDB = await transaccion.save();
        procesion.transaccion = transaccionDB._id;
        const procesionDB = await procesion.save();
    
        res.json({
            ok: true,
            procesionDB
        });
    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }
}

const crearActuacion = async(req, res = express.response) => {
    try {
        const actuacion = new Actuacion(req.body);

        // Validar que el usuario es directivo de la banda
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;
        
        // Comprobar que el directivo pertenece a la banda
        const directivos = Directivo.find({usuario: payloadId, banda: actuacion.banda, fecha_final: undefined});
        if(directivos.length == 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para crear esta procesión'
            });
        }

       

        // Comprobar que todas las fechas son válidas
        if(actuacion.fechaFin <= actuacion.fechaInicio) {
            return res.status(400).json({
                ok: false,
                msg: 'La fecha de finalización debe ser mayor a la fecha de inicio'
            });
        }

        if(actuacion.fechaInicio < actuacion.fechaSalida) {
            return res.status(400).json({
                ok: false,
                msg: 'La fecha de salida debe ser menos que la fecha de inicio'
            });
        }

        
        

        // Crear transacción
        let transaccion = {};
        const cantidad = actuacion.beneficios - actuacion.costes;
        if (cantidad > 0) {
             transaccion = new Transaccion({ "cantidad": cantidad, "motivo": actuacion.titulo , "descripcion": "Beneficios: " + actuacion.beneficios + " - Costes: " + actuacion.costes + " = " + cantidad + "€" + " - " + actuacion.comentarioEconomico,
              "fecha": actuacion.fechaSalida,  "tipo": "Beneficio", "banda": actuacion.banda });
        } else  {
            transaccion = new Transaccion({ "cantidad": cantidad, "motivo": actuacion.titulo , "descripcion": "Beneficios: " + actuacion.beneficios + " - Costes: " + actuacion.costes + " = -" + cantidad + "€" + " - " + actuacion.comentarioEconomico,
            "fecha": actuacion.fechaSalida,  "tipo": "Gasto", "banda": actuacion.banda });
        }
        const transaccionDB = await transaccion.save();
        actuacion.transaccion = transaccionDB._id;
        const actuacionDB = await actuacion.save();
    
        res.json({
            ok: true,
            actuacionDB
        });
    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }
}

const crearEnsayo = async(req, res = express.response) => {
    try {
        const ensayo = new Ensayo(req.body);

        // Validar que el usuario es directivo de la banda
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;
        
        // Comprobar que el directivo pertenece a la banda
        const directivos = Directivo.find({usuario: payloadId, banda: ensayo.banda, fecha_final: undefined});
        if(directivos.length == 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para crear esta procesión'
            });
        }


        // Comprobar que todas las fechas son válidas
        if(ensayo.fechaFin <= ensayo.fechaInicio) {
            return res.status(400).json({
                ok: false,
                msg: 'La fecha de finalización debe ser mayor a la fecha de inicio'
            });
        }
        const ensayoDB = await ensayo.save();
    
        res.json({
            ok: true,
            ensayoDB
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
    crearProcesion,
    crearActuacion,
    crearEnsayo
}