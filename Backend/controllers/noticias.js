const express = require('express');
const Anuncio = require('../models/Noticia');
const Directivo = require('../models/Directivo');
const Musico = require('../models/Musico');
const Archivero = require('../models/Archivero');
const jwt = require('jsonwebtoken');

/*
* Crea una noticia a partir de los datos recibidos en el body
*/
const crearNoticia = async(req, res = express.response) => {
    
    try {
        const anuncioReq = req.body;
        anuncioReq.fecha = new Date();
        const anuncio = new Anuncio(anuncioReq);

        // Validar que el usuario es directivo de la banda
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        const rolesDirectivo = await Directivo.find({usuario: payloadId, banda: anuncio.banda});
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
                msg: 'No tiene permisos para crear esta noticia'
            });
        }

        const anuncioDB = await anuncio.save();
    
        res.json({
            ok: true,
            anuncioDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }
}

/*
* Obtiene todas las noticias públicas de la base de datos
*/
const getDestacadas = async(req, res = express.response) => {  
    try {
        const anuncios = await Anuncio.find({privacidad: 'Pública', fecha : {$gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}});
        res.json({
            ok: true,
            anuncios
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

    // Obtener noticias de una banda según el rol del usuario
    // Si es usuario: solo las públicas
    // Si es músico: las públicas y las privadas
    // si es directivo: todas
    // Si es archivero: todas
const getByBanda = async(req, res = express.response) => {
    try {
        const bandaId = req.params.bandaId;
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;
        const directivos = await Directivo.find({'usuario': payloadId, 'banda': bandaId, 'fecha_final': undefined});
        const archiveros = await  Archivero.find({'usuario': payloadId, 'banda': bandaId, 'fecha_final': undefined});
        const musicos = await Musico.find({'usuario': payloadId, 'banda': bandaId, 'fecha_final': undefined});
        let anuncios = [];
        if(directivos.length > 0 || archiveros.length > 0) {
            anuncios = await Anuncio.find({banda: bandaId, privacidad: {$in: ['Pública', 'Privada', 'Restringida']}});
            
        } 
        else if(musicos.length > 0) {
            anuncios = await Anuncio.find({banda: bandaId, privacidad: {$in: ['Pública', 'Privada']}});
            
        }
        else {
            anuncios = await Anuncio.find({banda: bandaId, privacidad: 'Pública'}); 
        }
        res.json({
            ok: true,
            anuncios
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}



        

/*
* Eliminar una noticia por su id
*/
const eliminarNoticiaById = async(req, res = express.response) => {  
    try {
        const id = req.params.noticiaId;
        
        const anuncio = await Anuncio.findById(id);

        if(!anuncio) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe una noticia con ese id'
            });
        }

        // Validar que es directivo de la banda
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        const rolesDirectivo = await Directivo.find({usuario: payloadId, banda: anuncio.banda});
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
                msg: 'No tiene permisos para crear esta noticia'
            });
        }

        await anuncio.delete();

        res.json({
            ok: true,
            anuncio
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
    crearNoticia,
    getDestacadas,
    eliminarNoticiaById,
    getByBanda
}