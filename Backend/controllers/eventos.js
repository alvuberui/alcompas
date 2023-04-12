const express = require('express');
const Procesion = require('../models/Procesion');
const Directivo = require('../models/Directivo');
const Transaccion = require('../models/Transaccion');
const Actuacion = require('../models/Actuacion');
const Ensayo = require('../models/Ensayo');
const jwt = require('jsonwebtoken');

// Controladores sobre procesiones
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

const actualizarProcesion = async(req, res = express.response) => {
    try {
        const procesion = new Procesion(req.body);
        
        const procesionId = req.params.id;
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
        // Actualizar transacción
 
        const cantidad = procesion.beneficios - procesion.costes;
        if (cantidad > 0) {
             const nuevaTransaccion = new Transaccion({ "cantidad": cantidad, "motivo": procesion.titulo , "descripcion": "Beneficios: " + procesion.beneficios + " - Costes: " + procesion.costes + " = " + cantidad + "€" + " - " + procesion.comentarioEconomico,
              "fecha": procesion.fechaSalida,  "tipo": "Beneficio", "banda": procesion.banda });
                nuevaTransaccion._id = procesion.transaccion;
              await Transaccion.findByIdAndUpdate(procesion.transaccion.toString(), nuevaTransaccion);
        } else  {
            const nuevaTransaccion = new Transaccion({ "cantidad": cantidad, "motivo": procesion.titulo , "descripcion": "Beneficios: " + procesion.beneficios + " - Costes: " + procesion.costes + " = -" + cantidad + "€" + " - " + procesion.comentarioEconomico,
            "fecha": procesion.fechaSalida,  "tipo": "Gasto", "banda": procesion.banda });
            nuevaTransaccion._id = procesion.transaccion;
            await Transaccion.findByIdAndUpdate(procesion.transaccion.toString(), nuevaTransaccion);
        }
        
        const procesionDB = await Procesion.findByIdAndUpdate(procesionId, procesion);
        
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

// Controladores sobre actuaciones
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

const actualizarActuacion = async(req, res = express.response) => {
    try {
        const actuacion = new Procesion(req.body);
        const actuacionId = req.params.id;
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
        // Actualizar transacción
        let transaccion = {};
        const cantidad = actuacion.beneficios - actuacion.costes;
        if (cantidad > 0) {
             transaccion = new Transaccion({ "cantidad": cantidad, "motivo": actuacion.titulo , "descripcion": "Beneficios: " + actuacion.beneficios + " - Costes: " + actuacion.costes + " = " + cantidad + "€" + " - " + actuacion.comentarioEconomico,
              "fecha": actuacion.fechaSalida,  "tipo": "Beneficio", "banda": actuacion.banda });
              transaccion._id = actuacion.transaccion;
              await Transaccion.findByIdAndUpdate(actuacion.transaccion, transaccion);
        } else  {
            transaccion = new Transaccion({ "cantidad": cantidad, "motivo": actuacion.titulo , "descripcion": "Beneficios: " + actuacion.beneficios + " - Costes: " + actuacion.costes + " = -" + cantidad + "€" + " - " + actuacion.comentarioEconomico,
            "fecha": actuacion.fechaSalida,  "tipo": "Gasto", "banda": actuacion.banda });
            transaccion._id = actuacion.transaccion;
            await Transaccion.findByIdAndUpdate(actuacion.transaccion, transaccion);
        }
        const actuacionDB = await Actuacion.findByIdAndUpdate(actuacionId, actuacion);
    
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

// Controladores sobre ensayos
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

const actualizarEnsayo = async(req, res = express.response) => {
    try {
        const ensayo = new Ensayo(req.body);
       
        const ensayoId = req.params.id;
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
        
        const ensayoDB = await Ensayo.findByIdAndUpdate(ensayoId, ensayo);
    
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


// Controladores comunes SIN TERMANAR: FALTA POR COGER LOS QUE TIENEN MÁS ME GUSTA
const getDestacados = async(req, res = express.response) => {
    try {
        let eventos = [];
        const fecha = req.body.fecha;
        const dia = new Date(fecha).getDate();
        const procesiones = await Procesion.find({fechaInicio: { $gte: fecha, $lt: new Date(fecha).setDate(dia + 1) }});
        const actuaciones = await Actuacion.find({fechaInicio: { $gte: fecha, $lt: new Date(fecha).setDate(dia + 1) }});
        const ensayos = await Ensayo.find({fechaInicio: { $gte: fecha, $lt: new Date(fecha).setDate(dia + 1) }});
        eventos = [...procesiones, ...actuaciones, ...ensayos];

        res.json({
            ok: true,
            eventos
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const getEventosBandaFecha = async(req, res = express.response) => {
    try {
        let eventos = [];
        const fecha = req.body.fecha;
        const banda = req.body.banda;
        const dia = new Date(fecha).getDate();
        const procesiones = await Procesion.find({'banda': banda,'fechaInicio': { $gte: fecha, $lt: new Date(fecha).setDate(dia + 1) }});
        const actuaciones = await Actuacion.find({'banda': banda,'fechaInicio': { $gte: fecha, $lt: new Date(fecha).setDate(dia + 1) }});
        const ensayos = await Ensayo.find({'banda': banda,'fechaInicio': { $gte: fecha, $lt: new Date(fecha).setDate(dia + 1) }});
        eventos = [...procesiones, ...actuaciones, ...ensayos];

        res.json({
            ok: true,
            eventos
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const getByTipoId = async(req, res = express.response) => {
    try {
        const tipo = req.params.tipo;
        const id = req.params.id;

        if( tipo === 'Procesión') {
            const evento = await Procesion.findById(id);
            return res.json({
                ok: true,
                evento
            });
        } else if( tipo === 'Actuación') {
            const evento = await Actuacion.findById(id);
            return res.json({
                ok: true,
                evento
            });
        } else {
            const evento = await Ensayo.findById(id);
            return res.json({
                ok: true,
                evento
            });
        } 
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const eliminarEvento = async(req, res = express.response) => {
    try {
        const tipo = req.params.tipo;
        const id = req.params.id;
        let evento = undefined;
        if( tipo === 'Procesión') {
            const transaccion = await Procesion.findById(id).transaccion;
            await Transaccion.findByIdAndDelete(transaccion);
            evento = await Procesion.findByIdAndDelete(id);
        } else if( tipo === 'Actuación') {
            const transaccion = await Actuacion.findById(id).transaccion;
            await Transaccion.findByIdAndDelete(transaccion);
            evento = await Actuacion.findByIdAndDelete(id);
        } else {
            evento = await Ensayo.findByIdAndDelete(id);
        }
        res.json({
            ok: true,
            evento
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
    crearEnsayo,
    getDestacados,
    getEventosBandaFecha,
    actualizarProcesion,
    actualizarActuacion,
    actualizarEnsayo,
    getByTipoId,
    eliminarEvento
}