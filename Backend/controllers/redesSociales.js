const express = require('express');
const RedSocial = require('../models/RedSocial');

const crearRedSocial = async(req, res = express.response) => {
    try {
        
        const  redSocial = new RedSocial(req.body);
        const nuevaRedSocial = await redSocial.save();

        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        const directivos = await Directivo.find({"usuario": payloadId, "banda": redSocial.banda, "fecha_final": undefined});
        if(directivos.length === 0){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para crear redes sociales'
            });
        }

        res.json({
            ok: true,
            nuevaRedSocial
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }
}

const getRedesByBandaId = async(req, res = express.response) => {
    try {
        const id = req.params.id;
        const redes = await RedSocial.find({banda: id});

        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        const directivos = await Directivo.find({"usuario": payloadId, "banda": redSocial.banda, "fecha_final": undefined});
        if(directivos.length === 0){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para crear redes sociales'
            });
        }

        res.json({  
            ok: true,
            redes
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador' 
        });
    }   
}

const eliminarRedSocial = async(req, res = express.response) => {
    try {
        const id = req.params.id;

        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        const directivos = await Directivo.find({"usuario": payloadId, "banda": redSocial.banda, "fecha_final": undefined});
        if(directivos.length === 0){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para crear redes sociales'
            });
        }

        const redSocial = await RedSocial.findById(id);
        if(!redSocial){
            return res.status(404).json({
                ok: false,
                msg: 'Red social no encontrada'
            }); 
        }
        const red = await RedSocial.findByIdAndDelete(id);
        res.json({
            ok: true,
            red,
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
    crearRedSocial,
    getRedesByBandaId,
    eliminarRedSocial
    
}