const express = require('express');
const Peticion = require('../models/Peticion');
const Usuario = require('../models/Usuario');

const getPeticionesByUserId = async(req, res = express.response) => {
    
    try {
        const userId = req.params.userId;
        const peticiones = await Peticion.find({"Usuario": userId});

        res.json({
            ok: true,
            peticiones
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }
    
}

const crearPeticion = async(req, res = express.response) => {

    // Comprobar que el directivo pertenece a la banda

    try {
        const fecha = new Date();
        const estado = 'Pendiente';
        
        const peticion = req.body
        peticion.fecha = fecha;
        peticion.estado = estado;
        const nueva_peticion = await peticion.save();

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

const aceptarPeticion = async(req, res = express.response) => {

    // 1 )Comprobar que el usuario que quiere aceptar una petición es a quién 
    // va dirigida la petición.
    // 2 ) Comprobar que la petición está en estado pendiente.

    try {
        const peticionId = req.params.id;
        const userId = req.params.userId;
        const peticion = await Peticion.findById(peticionId);
       
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
        
         return    res.status(201).json({
                ok: true,
                peticionAceptada
            });
        

    } catch (error) {
        console.log(error);
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

        const peticionAceptada = await Peticion.findByIdAndUpdate( peticion._id, nuevaPeticion, { new: true });
        
         return    res.status(201).json({
                ok: true,
                peticionAceptada
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
    getPeticionesByUserId,
    crearPeticion,
    aceptarPeticion,
    rechazarPeticion
}