const express = require('express');
const Usuario = require('../models/Usuario');
const Banda = require('../models/Banda');
const Directivo = require('../models/Directivo');
const { response } = require('express');
const { subirArchivo } = require('../helpers/subir-archivo');
const path = require('path');
const fs   = require('fs');
const jwt = require('jsonwebtoken');

const añadirFoto = async(req, res = express.response) => {
    try {
        const { usuarioId} = req.params;

        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        if( usuarioId !== payloadId ){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para añadir una foto'
            });
        }


        const usuario = await Usuario.findById( usuarioId );
        const nombre = await subirArchivo( req.files, undefined, 'imgs/usuarios' );

        if( usuario.img ) {
            const pathImagen = path.join( __dirname, '../uploads/imgs/usuarios', usuario.img );
            if ( fs.existsSync( pathImagen ) ) {
                fs.unlinkSync( pathImagen );
            }
        }


        let nuevoUsuario = usuario;
        nuevoUsuario.img = nombre;
        const usuarioDb = await Usuario.findByIdAndUpdate( usuarioId, nuevoUsuario, { new: true } );
        res.json({
            ok: true,
            usuarioDb
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
}

const mostrarImagenUsuario = async(req, res = response ) => {
    try {
        const { userId } = req.params;

        let modelo;

        modelo = await Usuario.findById(userId);
        if ( !modelo ) {
            return res.status(400).json({
                msg: `No existe un usuario con el id ${ id }`
            });
        }

        // Si tiene imagen devuelve la ruta de su imagen
        if ( modelo.img ) {
            const pathImagen = path.join( __dirname, '../uploads/imgs/usuarios', modelo.img );
            if ( fs.existsSync( pathImagen ) ) {
                return res.sendFile( pathImagen )
            }
        }

        // Si no tiene imagen devuelve la imagen por defecto
        const pathImagen = path.join( __dirname, '../uploads/imgs/usuarios/no-image.webp');
        res.sendFile( pathImagen );
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
}

const añadirFotoBanda = async(req, res = express.response) => {
    try {
        const { bandaId } = req.params;

        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        const directivos = await Directivo.find({"usuario": payloadId, "banda": bandaId, "fecha_final": undefined});
        if(directivos.length === 0){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para crear redes sociales'
            });
        }
        const banda = await Banda.findById( bandaId );


        const nombre = await subirArchivo( req.files, undefined, 'imgs/bandas' );

        
        
        if( banda.img ) {
            const pathImagen = path.join( __dirname, '../uploads/imgs/bandas', banda.img );
            if ( fs.existsSync( pathImagen ) ) {
                fs.unlinkSync( pathImagen );
            }
        }
        
        let nuevaBanda = banda;
        nuevaBanda.img = nombre;
        const bandaDb = await Banda.findByIdAndUpdate( bandaId, nuevaBanda, { new: true } );
        res.json({
            ok: true,
            bandaDb
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
}

const mostrarImagenBanda = async(req, res = response ) => {
    try {
        const { bandaId } = req.params;

        let modelo;

        modelo = await Banda.findById(bandaId);
        if ( !modelo ) {
            return res.status(400).json({
                msg: `No existe un usuario con el id ${ id }`
            });
        }

        // Si tiene imagen devuelve la ruta de su imagen
        if ( modelo.img ) {
            const pathImagen = path.join( __dirname, '../uploads/imgs/bandas', modelo.img );
            if ( fs.existsSync( pathImagen ) ) {
                return res.sendFile( pathImagen )
            }
        }

        // Si no tiene imagen devuelve la imagen por defecto
        const pathImagen = path.join( __dirname, '../uploads/imgs/bandas/no-image.png');
        res.sendFile( pathImagen );
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
}

module.exports = {
    añadirFoto,
    mostrarImagenUsuario,
    añadirFotoBanda,
    mostrarImagenBanda
}