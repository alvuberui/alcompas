const express = require('express');
const Peticion = require('../models/Peticion');
const Directivo = require('../models/Directivo');
const Musico = require('../models/Musico');
const Archivero = require('../models/Archivero');
const jwt = require('jsonwebtoken');

const getPeticionesByUserId = async(req, res = express.response) => {
    
    try {
        const userId = req.params.userId;

        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        if(userId != payloadId) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos'
            });
        }

        const peticiones = await Peticion.find({"usuario": userId});



        res.json({
            ok: true,
            peticiones
        });
    } catch (error) {
        console.log("Error obteniendo las peticiones");
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }
    
}

const crearPeticion = async(req, res = express.response) => {
    
    // Comprobar que el directivo pertenece a la banda
    // Comprobar que el receptor de la petición no tiene ya un mismo rol en la banda o pendiente de aceptar.

    try {
        const fecha = new Date();
        const estado = 'Pendiente';
        
        const peticion = req.body
        peticion.fecha = fecha;
        peticion.estado = estado;

        // Comparar que el directivo pertenece a la banda
        const directivoId = peticion.directivo;
        const bandaId = peticion.banda;
        const directivo = await Directivo.findById(directivoId);

        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        const directivos = await Directivo.find({"usuario": payloadId, "banda": bandaId, fecha_final: undefined});
        if(directivos.length == 0) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para crear una petición'
            });
        }
        
        // Comprobar que el receptor de la petición no tiene ya un mismo rol en la banda o pendiente de aceptar.
        const usuarioId = peticion.usuario;
        const peticiones = await Peticion.find({"usuario": usuarioId, "banda": bandaId});
        
        for(const peticiondbl of peticiones) {
            if(peticiondbl.estado == 'Pendiente' && peticiondbl.rol == peticion.rol) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El usuario ya tiene una petición pendiente en la banda'
                });
            }
        }
        
        if(peticion.rol == 'Directivo') {
            const roles = await Directivo.find({"usuario": usuarioId, "banda": bandaId});
            for(const rol of roles) {
                if( rol.fecha_final === undefined) {
                    return res.status(400).json({
                        ok: false, 
                        msg: 'El usuario ya tiene este rol en la banda'
                    });
                }
            }
        }
        
        if(peticion.rol == 'Músico') {
            const roles = await Musico.find({"usuario": usuarioId, "banda": bandaId});
            for(const rol of roles) {     
                if(rol.fecha_final === undefined ) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'El usuario ya tiene este rol en la banda'
                    });
                }
            }
        }
        if(peticion.rol == 'Archivero') {
            const roles = await Archivero.find({"usuario": usuarioId, "banda": bandaId});
            for(const rol of roles) {
                if( rol.fecha_final === undefined ) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'El usuario ya tiene este rol en la banda'
                    });
                }
            }
        }

        if(peticion.rol === 'Músico' && (peticion.instrumento === undefined || peticion.instrumento === '' 
        || peticion.voz === '' || peticion.voz === undefined || peticion.cargo !== undefined))  {
            return res.status(400).json({
                ok: false,
                msg: 'Petición inválida'
            });
        }

        if(peticion.rol === 'Archivero' && (peticion.instrumento !== undefined 
         || peticion.voz !== undefined || peticion.cargo !== undefined))  {
            return res.status(400).json({
                ok: false,
                msg: 'Petición inválida'
            });
        }
        if(peticion.rol === 'Directivo' && (peticion.instrumento !== undefined 
         || peticion.voz !== undefined || peticion.cargo === undefined || cargo === ''))  {
            return res.status(400).json({
                ok: false,
                msg: 'Petición inválida'
            });
        }

       
        
        const peticionDB = new Peticion(peticion);
       
        const nueva_peticion = await peticionDB.save();
        
        res.json({
            ok: true,
            peticion: nueva_peticion
        });

    } catch (error) {
        console.log("Error obteniendo las peticiones");
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }

}

const aceptarPeticion = async(req, res = express.response) => {

    // 1 )Comprobar que el usuario que quiere aceptar una petición es a quién 
    // va dirigida la petición.
    // 2 ) Comprobar que la petición está en estado pendiente.

    try {
        const peticionId = req.params.id;
        const userId = req.params.userId;
        const peticion = await Peticion.findById(peticionId);

        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        if( payloadId != peticion.usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permiso para aceptar esta petición'
            });
        }
       
        if(peticion.estado != 'Pendiente') {
            return res.status(400).json({
            ok: false, 
            msg: 'La petición no está en estado pendiente'
             });
        }
        if( peticion.usuario != userId ) {
            return res.status(400).json({
                ok: false, 
                msg: 'No tiene permiso para aceptar esta petición'
            });
        } 

        let nuevaPeticion = peticion;
        nuevaPeticion.estado = 'Aceptada';

        const peticionAceptada = await Peticion.findByIdAndUpdate( peticion._id, nuevaPeticion, { new: true });

        // Se crea el rol en la tabla de roles correspondiente
        if(peticion.rol == 'Directivo') {
            const directivo = new Directivo({fecha_inicio: new Date(), cargo: peticion.cargo, usuario: peticion.usuario, banda: peticion.banda});
            await directivo.save();
        }
        if(peticion.rol == 'Músico') {
            
            const musico = new Musico({fecha_inicio: new Date(), instrumento: peticion.instrumento, voz: peticion.voz, usuario: peticion.usuario, banda: peticion.banda});
            await musico.save();
        }
        if(peticion.rol == 'Archivero') {
            const archivero = new Archivero({fecha_inicio: new Date(), usuario: peticion.usuario, banda: peticion.banda});
            await archivero.save();
        }
        
         return    res.status(201).json({
                ok: true,
                peticionAceptada
            });
        

    } catch (error) {
        console.log("Error obteniendo las peticiones");
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }
}

const rechazarPeticion = async(req, res = express.response) => {

    // 1 )Comprobar que el usuario que quiere aceptar una petición es a quién 
    // va dirigida la petición.
    // 2 ) Comprobar que la petición está en estado pendiente.

    try {
        const peticionId = req.params.id;
        const userId = req.params.userId;
        const peticion = await Peticion.findById(peticionId);

        const token = req.header('x-token');
        const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
        const payloadId = payload.uid;

        if( payloadId != peticion.usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permiso para aceptar esta petición'
            });
        }
       
        if(peticion.estado != 'Pendiente') {
            return res.status(400).json({
            ok: false, 
            msg: 'La petición no está en estado pendiente'
             });
        }
        if( peticion.usuario != userId ) {
            return res.status(400).json({
                ok: false, 
                msg: 'No tiene permiso para aceptar esta petición'
            });
        } 

        let nuevaPeticion = peticion;
        nuevaPeticion.estado = 'Denegada';

        const peticionRechazada = await Peticion.findByIdAndUpdate( peticion._id, nuevaPeticion, { new: true });

        
         return    res.status(201).json({
                ok: true,
                peticionRechazada
            });
        

    } catch (error) {
        console.log("Error rechazando la petición");
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }
}

const getPeticionesByBandaId = async(req, res = express.response) => {
        
        try {
            const bandaId = req.params.bandaId;
            const peticiones = await Peticion.find({"banda": bandaId});

            const token = req.header('x-token');
            const payload = jwt.verify(token,process.env.SECRET_JWT_SEED);
            const payloadId = payload.uid;

            const directivos = await Directivo.find({"usuario": payloadId, "banda": bandaId, "fecha_final": undefined});

            if(directivos.length == 0) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No tiene permiso para ver las peticiones de esta banda'
                });
            }
            
            res.json({
                ok: true,
                peticiones
            });
        } catch (error) {
            console.log("Error obteniendo las peticiones");
            res.status(500).json({
                ok: false, 
                msg: 'Por favor hable con el administrador'
            });
        }
}

module.exports = {
    getPeticionesByUserId,
    crearPeticion,
    aceptarPeticion,
    rechazarPeticion,
    getPeticionesByBandaId
}