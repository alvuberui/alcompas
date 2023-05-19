const express = require('express');
const jwt = require('jsonwebtoken');
const Directivo = require('../models/Directivo');
const Repertorio = require('../models/Repertorio');
const Archivero = require('../models/Archivero');
const Obra = require('../models/Obra');
const Partitura = require('../models/Partitura');
const path = require('path');
const fs   = require('fs');

const crearObra = async(req, res = express.response) => {
    try {
        const obra = new Obra(req.body);

        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        const repertorio = await Repertorio.findById(obra.repertorio);

        if(!repertorio){
            return res.status(404).json({
                ok: false,
                msg: 'No existe el repertorio'
            });
        }

        const archiveros = await Archivero.find({"usuario": payloadId, "banda": repertorio.banda, "fecha_final": undefined});
        if(archiveros.length === 0){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para crear obras'
            });
        }

       
        

        const nuevaObra = await obra.save();
        return res.json({
            ok: true,
            nuevaObra
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }
}

const obtenerByRepertorioId = async(req, res = express.response) => {
    try {
        const id = req.params.repertorioId;
        const obras = await Obra.find({repertorio: id});
        // ordenar obras alfabeticamete por el titulo
        obras.sort((a, b) => (a.titulo > b.titulo) ? 1 : -1);
        res.json({
            ok: true,
            obras
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const eliminarObra = async(req, res = express.response) => {
    try {
        const id = req.params.id;
        const obra = await Obra.findById(id);
        if(!obra){
            return res.status(404).json({
                ok: false,
                msg: 'No existe la obra'
            });
        }
        const repertorio = await Repertorio.findById(obra.repertorio);
        
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        const archiveros = await Archivero.find({"usuario": payloadId, "banda": repertorio.banda, "fecha_final": undefined});
        if(archiveros.length === 0){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para eliminar obras'
            });
        }

        await Obra.findByIdAndDelete(id);
        const partituras = await  Partitura.find({obra: id});

        for(let i = 0; i < partituras.length; i++){
            const partitura = partituras[i];
            const pathImagen = path.join( __dirname, '../uploads/partituras/', partitura.url );
            if ( fs.existsSync( pathImagen ) ) {
                fs.unlinkSync( pathImagen );
            }
        }
        await Partitura.deleteMany({obra: id});
        res.json({
            ok: true,
            obra
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
    crearObra,
    obtenerByRepertorioId,
    eliminarObra
}