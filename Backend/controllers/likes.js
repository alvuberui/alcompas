const express = require('express');
const Like = require('../models/Like');
const Directivo = require('../models/Directivo');
const Musico = require('../models/Musico');
const Archivero = require('../models/Archivero');
const Noticia = require('../models/Noticia');
const Ensayo = require('../models/Ensayo');
const Banda = require('../models/Banda');
const Procesion = require('../models/Procesion');
const Actuacion = require('../models/Actuacion');
const Comentario = require('../models/Comentario');

const jwt = require('jsonwebtoken');

/*
* Publicar like a una de las entidades válidas
*/
const publicarLike = async(req, res = express.response) => {
    
    try {
        const likeReq = req.body;
        likeReq.fecha = new Date();
        const like = new Like(likeReq);

        // Comprobar que puede dar like )
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        const likes = Like.find({usuario: payloadId, tipo: likeReq.tipo, referencia: likeReq.referencia});

        if( likes.length > 0 ) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya ha dado like a esta entidad'
            });
        }

        if(likeReq.tipo == 'Noticia') {
            const noticia = await Noticia.findById(likeReq.referencia);
            if( noticia.privacidad == 'Privada' ) {
                const musico = await Musico.findOne({usuario: payloadId, banda: noticia.banda});
                const directivo = await Directivo.findOne({usuario: payloadId, banda: noticia.banda});
                const archivero = await Archivero.findOne({usuario: payloadId, banda: noticia.banda});
                if( ! musico && ! directivo && ! archivero) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No tiene permisos para dar like a esta noticia'
                    });
                }
            }
            else if( noticia.privacidad == 'Restringida' ) {
                const directivo = await Directivo.findOne({usuario: payloadId, banda: noticia.banda});
                if( ! directivo ) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No tiene permisos para dar like a esta noticia'
                    });
                }
            }
        }
        else if(likeReq.tipo == 'Ensayo') {
            const ensayo = await Ensayo.findById(likeReq.referencia);
            const musico = await Musico.findOne({usuario: payloadId, banda: ensayo.banda});
            const directivo = await Directivo.findOne({usuario: payloadId, banda: ensayo.banda});
            const archivero = await Archivero.findOne({usuario: payloadId, banda: ensayo.banda});
            if( ! musico && ! directivo && ! archivero) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No tiene permisos para dar like a este ensayo'
                });
            }
        }
        const likeDB = await like.save();
        res.json({
            ok: true,
            likeDB
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
* Publicar like a una de las entidades válidas
*/
const publicarDislike = async(req, res = express.response) => {
    
    try {
        const tipo = req.params.tipo;
        const referencia = req.params.referencia;
        let like = null;

        // Comprobar que puede dar like )
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;
        const l = await Like.find({usuario: payloadId, tipo: tipo, referencia: referencia});

        if( l.length > 0  ) {
            like = l[0];
        } else {
            return res.status(400).json({
                ok: false,
                msg: 'No ha dado like a esta entidad'
            });
        }

        if( tipo === 'Noticia') {
            const noticia = await Noticia.findById(referencia);
            if( noticia.privacidad == 'Privada' ) {
                const musico = await Musico.findOne({usuario: payloadId, banda: noticia.banda});
                const directivo = await Directivo.findOne({usuario: payloadId, banda: noticia.banda});
                const archivero = await Archivero.findOne({usuario: payloadId, banda: noticia.banda});
                if( ! musico && ! directivo && ! archivero) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No tiene permisos para dar dislike a esta noticia'
                    });
                }
            }
            else if( noticia.privacidad == 'Restringida' ) {
                const directivo = await Directivo.findOne({usuario: payloadId, banda: noticia.banda});
                if( ! directivo ) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No tiene permisos para dar dislike a esta noticia'
                    });
                }
            }
            await Like.findByIdAndDelete(like._id);
        }
        else if( tipo === 'Ensayo') {
            const ensayo = await Ensayo.findById(referencia);
            const musico = await Musico.findOne({usuario: payloadId, banda: ensayo.banda});
            const directivo = await Directivo.findOne({usuario: payloadId, banda: ensayo.banda});
            const archivero = await Archivero.findOne({usuario: payloadId, banda: ensayo.banda});
            if( ! musico && ! directivo && ! archivero) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No tiene permisos para dar dislike a esta noticia'
                });
            }
            await Like.findByIdAndDelete(like._id);
        }
        else {
            await Like.findByIdAndDelete(like._id);
        }
        res.json({
            ok: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }
}

const getLikeByTipoAndReferencia = async(req, res = express.response) => {
    try {
        const tipo = req.params.tipo;
        const referencia = req.params.referencia;
        // Comprobar que puede dar like )
        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;
        let resp = false;

        const likes = await Like.find({tipo: tipo, referencia: referencia, usuario: payloadId});

        if( likes.length > 0 ) {
            resp = true;
        }
        else {
            resp = false;
        }
 
        res.json({
            ok: true,
            like: resp
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const getNumeroDeLikes = async(req, res = express.response) => {
    try {
        const tipo = req.params.tipo;
        const referencia = req.params.referencia;

        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        if(tipo === 'Noticia') {
            const noticia = await Noticia.findById(referencia);
            if( noticia.privacidad == 'Privada' ) {
                const musico = await Musico.findOne({usuario: payloadId, banda: noticia.banda});
                const directivo = await Directivo.findOne({usuario: payloadId, banda: noticia.banda});
                const archivero = await Archivero.findOne({usuario: payloadId, banda: noticia.banda});
                if( ! musico && ! directivo && ! archivero) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No tiene permisos para dar dislike a esta noticia'
                    });
                }
            }
            else if( noticia.privacidad == 'Restringida' ) {
                const directivo = await Directivo.findOne({usuario: payloadId, banda: noticia.banda});
                if( ! directivo ) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'No tiene permisos para dar dislike a esta noticia'
                    });
                }
            }
        }
        else if( tipo === 'Ensayo') {
            const ensayo = await Ensayo.findById(referencia);
            const musico = await Musico.findOne({usuario: payloadId, banda: ensayo.banda});
            const directivo = await Directivo.findOne({usuario: payloadId, banda: ensayo.banda});
            const archivero = await Archivero.findOne({usuario: payloadId, banda: ensayo.banda});
            if( ! musico && ! directivo && ! archivero) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No tiene permisos para dar dislike a esta noticia'
                });
            }
        }
        const likes = await Like.find({'tipo': tipo, 'referencia': referencia});

        const numero = likes.length;
        res.json({
            ok: true,
            likes: numero
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
    publicarLike,
    publicarDislike,
    getLikeByTipoAndReferencia,
    getNumeroDeLikes
}