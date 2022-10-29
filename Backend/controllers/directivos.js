const express = require('express');
const Directivo = require('../models/Directivo');


const crearDirectivo = async(req, res = express.response) => { 
    try {
        const usuarioId = req.uid;
        const roles_directivo = await Directivo.find({'usuario': usuarioId});
        
        for (i=0; i < roles_directivo.length; i++) {
            rol = roles_directivo[i];
            if(!rol.fecha_final) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya tiene el rol de directivo'
                });
            }
        }

        let directivo = new Directivo(req.body);
        directivo.usuario = req.uid;
        const directivoDB = await directivo.save();

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

const finalizarDirectivo = async(req, res = express.response) => { 
    try {
        const usuarioId = req.uid;
        const roles_directivo = await Directivo.find({'usuario': usuarioId});
        
        for(i=0; i < roles_directivo.length; i++) {
            rol = roles_directivo[i];
                
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
            msg: 'No hay ningún rol directivo sin finalizar'
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });

    }
}

const eliminarDirectivos = async(req, res = express.response) => { 
    const usuarioId = req.params.id;
    try {
        const directivo = await Directivo.deleteMany({'usuario': usuarioId});
        
        
        return res.status(201).json({
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

module.exports = {
    crearDirectivo,
    finalizarDirectivo,
    eliminarDirectivos
}