const express = require('express');
const jwt = require('jsonwebtoken');
const Directivo = require('../models/Directivo');
const Repertorio = require('../models/Repertorio');
const Archivero = require('../models/Archivero');
const Obra = require('../models/Obra');
const Partitura = require('../models/Partitura');
const path = require('path');
const fs   = require('fs');


const crearRepertorio = async(req, res = express.response) => {
    try {
        const repertorio = new Repertorio(req.body);

        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        const archiveros = await Archivero.find({"usuario": payloadId, "banda": repertorio.banda, "fecha_final": undefined});
        if(archiveros.length === 0){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para crear repertorios'
            });
        }

        const nuevoRepertorio = await repertorio.save();
        return res.json({
            ok: true,
            nuevoRepertorio
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }
}

const getRepertoriosByBandaId = async(req, res = express.response) => {
    try {
        const id = req.params.bandaId;
        const repertorios = await Repertorio.find({banda: id});

        res.json({
            ok: true,
            repertorios
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const eliminarRepertorio = async(req, res = express.response) => {
    try {
        const id = req.params.id;
        // Comprobar que es archivero
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        const repertorio = await Repertorio.findById(id);
        if(!repertorio){
            return res.status(404).json({
                ok: false,
                msg: 'Repertorio no encontrado por id'
            });
        }

        const archiveros = await Archivero.find({"usuario": payloadId, "banda": repertorio.banda, "fecha_final": undefined});
        if(archiveros.length === 0){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para eliminar repertorios'
            });
        }

        await Repertorio.findByIdAndDelete(id);
        const obras = await Obra.find({repertorio: id});
        for(let i = 0; i < obras.length; i++){
            const partituras = await Partitura.find({obra: obras[i]._id});
            for(let j = 0; j < partituras.length; j++){
                const pathImagen = path.join( __dirname, '../uploads/partituras/', partituras[j].url );
                if ( fs.existsSync( pathImagen ) ) {
                    fs.unlinkSync( pathImagen );
                }
            }
            await Partitura.deleteMany({obra: obras[i]._id});
        }
        await Obra.deleteMany({repertorio: id});
        res.json({
            ok: true,
            msg: 'Repertorio eliminado',
            repertorio
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
    crearRepertorio,
    getRepertoriosByBandaId,
    eliminarRepertorio
}