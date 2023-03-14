const express = require('express');
const Anuncio = require('../models/Noticia');
const Directivo = require('../models/Directivo');
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

module.exports = {
    crearNoticia,
    getDestacadas
}