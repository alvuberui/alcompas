const express = require('express');
const Archivero = require('../models/Archivero');

const crearArchivero = async(req, res = express.response) => {
    try {
        const usuarioId = req.uid;
        let archiveroNuevo = new Archivero(req.body);

        // Comrpobamos que la banda tenga sitio para más archiveros
        const bandaId = archiveroNuevo.banda;
        const archiveros_banda = await Archivero.find({'banda': bandaId});
        const archiveros_actuales = []
        for (i=0; i<archiveros_banda.length; i++) {
            let archivero = archiveros_banda[i];
            if(!archivero.fecha_final){
                archiveros_actuales.push(archivero);
            }
        }
        if(archiveros_actuales.length >= 3) {
            return res.status(400).json({
                ok: false,
                msg: 'No están permitidos más archiveros actualmente'
            });
        }

        // Comprobamos que no sea archivero actualmente
        const roles_archivero = await Archivero.find({'usuario': usuarioId});
        
        for (i=0; i<roles_archivero.length; i++) {
            let rol = roles_archivero[i];
            if(rol.fecha_final == undefined) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya tiene el rol de archivero actualmente'
                });
            }
        }

        
        archiveroNuevo.usuario = req.uid;
        const archiveroDB = await archiveroNuevo.save();

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

const finalizarArchivero = async(req, res = express.response) => { 
    try {
        const usuarioId = req.uid;
        const roles_archivero = await Archivero.find({'usuario': usuarioId});
        
        for(i=0; i < roles_archivero.length; i++) {
            rol = roles_archivero[i];
         
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
            msg: 'No hay ningún rol archivero sin finalizar'
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


module.exports = {
    crearArchivero,
    finalizarArchivero,
    eliminarArchiveros,
}