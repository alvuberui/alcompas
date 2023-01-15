const express = require('express');
const Banda = require('../models/Banda');
const Musico = require('../models/Musico');
const Archivero = require('../models/Archivero');
const Directivo = require('../models/Directivo');
const Usuario = require('../models/Usuario');
const RedSocial = require('../models/RedSocial');
const Comentario = require('../models/Comentario');
const path = require('path');
const fs   = require('fs');

const crearBanda = async(req, res = express.response) => {

    const { nombre, tipo_banda, localidad, provincia, codigo_postal,
        direccion, año_fundacion, descripcion, telefono, correo, cif} = req.body;


    try {
        let banda = await Banda.findOne( {correo} );
        if(banda) {
            return res.status(400).json({
                ok: false,
                msg: 'Una banda existe con ese correo'
            });
        }

        banda = await Banda.findOne( {telefono} );
        if(banda) {
            return res.status(400).json({
                ok: false,
                msg: 'Una banda existe con ese teléfono'
            });
        }

        banda = await Banda.findOne( {cif} );
        if(banda) {
            return res.status(400).json({
                ok: false,
                msg: 'Una banda existe con ese cif'
            });
        }

        const usuarioId = req.uid;

        

        banda = new Banda(req.body);
        const nueva_banda = await banda.save();
        const directivo = new Directivo({'fecha_inicio': new Date(), 'cargo': 'Presidente', 'usuario': usuarioId, 'banda': nueva_banda._id})
        const nuevo_directivo = await directivo.save();
        res.status(201).json({
            ok: true,
            nueva_banda,
            nuevo_directivo
        });


    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
}

const actualizar_banda = async(req, res = express.response) => {
    const bandaId = req.params.id;
    const { nombre, tipo_banda, localidad, provincia, codigo_postal,
        direccion, año_fundacion, descripcion, telefono, correo, cif} = req.body;
    try {
        let banda = await Banda.findById( bandaId );
        if( !banda ) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe banda'
            });
        }
        banda = await Banda.findOne( {correo} );
        if(banda) {
            return res.status(400).json({
                ok: false,
                msg: 'Una banda existe con ese correo'
            });
        }

        banda = await Banda.findOne( {telefono} );
        if(banda) {
            return res.status(400).json({
                ok: false,
                msg: 'Una banda existe con ese teléfono'
            });
        }

        banda = await Banda.findOne( {cif} );
        if(banda) {
            return res.status(400).json({
                ok: false,
                msg: 'Una banda existe con ese cif'
            });
        }


        const nuevaBanda = {
            ...req.body,
        }
        const bandaActualizada = await Banda.findByIdAndUpdate( bandaId, nuevaBanda, { new: true });

        res.status(201).json({
            ok: true,
            banda: bandaActualizada
        });
    
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: error.codeName
        });
    }
}

const eliminar_banda = async(req, res = express.response) => {
    const bandaId = req.params.id;
    const usuarioId = req.uid;
    try {
        const banda = await Banda.findById(bandaId);
        
        // Finalizar roles de archiveros, musicos, directivos
        const archiveros = await Archivero.find({'banda': bandaId});
        const musicos = await Musico.find({'banda': bandaId});
        const directivos = await  Directivo.find({'banda': bandaId});
        const presidentes = await Directivo.find({'cargo': 'Presidente', 'banda': bandaId});
        let presidente_actual;

        const d = await Directivo.find({'usuario': usuarioId, 'banda': bandaId});

        if(d.length == 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No eres directivo de esta banda'
            });
        }

        // Comprobar que es el presidente quien quiere eliminar la banda
        for(i=0; i < presidentes.length; i++) {
            let presidente = presidentes[i];
            if(!presidente.fecha_final && presidente.usuario == usuarioId) {
                presidente_actual = presidente;
            }
        }



        if(presidente_actual.usuario != usuarioId) {
            return res.status(400).json({
                ok: false,
                msg: 'Solo el presidente puede eliminar la banda'
            });
        }
        

        for(i=0; i < archiveros.length; i++) {
            let archivero = archiveros[i];
            if(!archivero.fecha_final) {
                archivero.fecha_final = new Date();
                await archivero.save();
            }
        }
        for(i=0; i < musicos.length; i++) {
            let musico = musicos[i];
            if(!musico.fecha_final) {
                musico.fecha_final = new Date();
                await musico.save();
            }
        }
        for(i=0; i < directivos.length; i++) {
            let directivo = directivos[i];
            if(!directivo.fecha_final) {
                directivo.fecha_final = new Date();
                await directivo.save();
            }
        }

        // Eliminamos todas las composiciones de la banda
        const redes = RedSocial.find({'banda': bandaId});
        const comentarios = Comentario.find({'banda': bandaId});

        for(i=0; i < redes.length; i++) {
            let red = redes[i];
            await red.remove();
        }
        for(i=0; i < comentarios.length; i++) {
            let comentario = comentarios[i];
            await comentario.remove();
        }

        // Eliminamos la foto de perfil de la banda
        if( banda.img ) {
            const pathImagen = path.join( __dirname, '../uploads/imgs/bandas', banda.img );
            if ( fs.existsSync( pathImagen ) ) {
                fs.unlinkSync( pathImagen );
            }
        }

        const banda_eliminada = await Banda.deleteOne(banda);
        res.status(201).json({
            ok: true,
            banda_eliminada
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: error.codeName
        });
    }
}

const getBandasByUserId = async( req, res = express.response ) => {
    try {
        let bandas = [];

        const userId = req.params.userId;

        const directivos = await Directivo.find({'usuario': userId, 'fecha_final': null});
        const musicos = await Musico.find({'usuario': userId, 'fecha_final': null});
        const archiveros = await Archivero.find({'usuario': userId, 'fecha_final': null});

        for(i=0; i < directivos.length; i++) {
            let directivo = directivos[i];
            if(!directivo.fecha_final) {
                const banda = await Banda.findById(directivo.banda);
                if(!  bandas.some(e => e.cif === banda.cif) ) {
                    bandas.push(banda);
                }
            }
        }
        
        for(i=0; i < musicos.length; i++) {
            let musico = musicos[i];
            if(!musico.fecha_final) {
                const banda = await Banda.findById(musico.banda);
                if( ! bandas.some(e => e.cif === banda.cif)) {
                    bandas.push(banda);
                }
            }
        }
        for(i=0; i < archiveros.length; i++) {
            let archivero = archiveros[i];
            if(!archivero.fecha_final) {
                const banda = await Banda.findById(archivero.banda);
                if( ! bandas.some(e => e.cif === banda.cif) ) {
                    bandas.push(banda);
                }
            }
        }


        res.status(201).json({
            ok: true,
            bandas
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
}

const getBandaById = async( req, res = express.response ) => {
    try {
        const bandaId = req.params.id;
        const banda = await Banda.findById(bandaId);

        res.status(201).json({
            ok: true,
            banda
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
}

const getBandas = async( req, res = express.response ) => {
    try {
        const bandas = await Banda.find();

        res.status(201).json({
            ok: true,
            bandas
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
}

const getBandasByNombre = async( req, res = express.response ) => {
    try {
        const bandas = await Banda.find();
        resultado = [];
        for(i=0; i < bandas.length; i++) {
            let banda = bandas[i];
            if(banda.nombre.toLowerCase().includes(req.params.nombre.toLowerCase())) {
                resultado.push(banda);
            }
        }

        res.status(201).json({
            ok: true,
            resultado
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
    crearBanda,
    actualizar_banda,
    eliminar_banda,
    getBandaById,
    getBandasByUserId,
    getBandas,
    getBandasByNombre
}