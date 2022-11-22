const express = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

/*
* En primer lugar se comprueba si existe ya un usuario con ese correo, nif o telefon, en caso de que no se
* encripta la contraseña y se envía a base de datos, generando su json web token (JWT).
*/
const crearUsuario = async(req, res = express.response) => {

    const { nombre, primer_apellido, segundo_apellido, fecha_nacimiento, correo, descripcion, localidad,
            provincia, codigo_postal, direccion, nif, telefono, usuario, contraseña, administrador} = req.body;

    try{
        let nuevo_usuario = await Usuario.findOne( {correo} );
        if(nuevo_usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            });
        }

        nuevo_usuario = await Usuario.findOne( {nif} );
        if(nuevo_usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese nif'
            });
        }

        nuevo_usuario = await Usuario.findOne( {telefono} );
        if(nuevo_usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese teléfono'
            });
        }
        nuevo_usuario = await Usuario.findOne( {usuario} );
        if(nuevo_usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese nombre de usuario'
            });
        }

        nuevo_usuario = new Usuario(req.body);
        nuevo_usuario.administrador = false;

        // Encriptar contraseña 
        const salt = bcrypt.genSaltSync();
        nuevo_usuario.contraseña = bcrypt.hashSync(contraseña, salt);
        await nuevo_usuario.save();

        // Generar JWT
        const token = await generarJWT( nuevo_usuario.id, nuevo_usuario.nombre );

        res.status(201).json({
            ok: true,
            msg: 'registro',
            uid: nuevo_usuario.id,
            nombre: nuevo_usuario.nombre,
            token
    });
    } catch(error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
    
}

/*
* En primer lugar se comprueba si existe ya un usuario con ese correo, nif o telefon, en caso de que no se
* encripta la contraseña y se envía a base de datos, generando su json web token (JWT).
*/
const cambiarDatos = async(req, res = express.response) => {

    const { nombre, primer_apellido, segundo_apellido, fecha_nacimiento, correo, descripcion, localidad,
            provincia, codigo_postal, direccion, nif, telefono, usuario, contraseña, administrador} = req.body;
    const id = req.params.id;
    try{
        let nuevo_usuario = await Usuario.findOne( {correo} );
        if(nuevo_usuario && nuevo_usuario.id != id) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese correo'
            });
        }

        nuevo_usuario = await Usuario.findOne( {nif} );
        if(nuevo_usuario && nuevo_usuario.id != id ) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese nif'
            });
        }

        nuevo_usuario = await Usuario.findOne( {telefono} );
        if(nuevo_usuario && nuevo_usuario.id != id ) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese teléfono'
            });
        }
        nuevo_usuario = await Usuario.findOne( {usuario} );
        if(nuevo_usuario && nuevo_usuario.id != id ) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con ese nombre de usuario'
            });
        }

        const antiguo_usuario = await Usuario.findById(id);


        nuevo_usuario = new Usuario(req.body);
        nuevo_usuario.administrador = false;
        nuevo_usuario.contraseña = antiguo_usuario.contraseña;
        nuevo_usuario._id = antiguo_usuario._id;

        const actualizado = await Usuario.findByIdAndUpdate(id, nuevo_usuario, { new: true });
     
        // Generar JWT
        const token = await generarJWT( actualizado.id, actualizado.nombre );

        res.status(201).json({
            ok: true,
            msg: 'actualizado datos de usuario',
            uid: actualizado._id,
            nombre: actualizado.nombre,
            token
    });
    } catch(error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
    
}

const modificarContraseña = async(req, res = express.response) => {
    // Comprobar que la contraseña actual es cierta
    try {
        const values = req.body;
        const userId = req.params.id;

        const salt = bcrypt.genSaltSync();
        let usuario = await Usuario.findById(userId);
        // Encriptar contraseña 
        const contraseñaNuevaEncriptada = bcrypt.hashSync(values.contraseñaNueva, salt);

        usuario.contraseña = contraseñaNuevaEncriptada;
        usuarioModificado = await Usuario.findByIdAndUpdate(userId, usuario, { new: true });
         // Generar JWT
         const token = await generarJWT( usuarioModificado.id, usuarioModificado.nombre );
        res.status(201).json({
            ok: true,
            msg: 'actualizado datos de usuario',
            uid: usuarioModificado._id,
            nombre: usuarioModificado.nombre,
            token
    });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador.'
        });
    }
}

const loginUsuario = async(req, res = express.response) => {
    const { correo, contraseña } = req.body;
    try{
        const nuevo_usuario = await Usuario.findOne( {correo} );
        if(!nuevo_usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Email incorrecto'
            });
        }
        const contraseña_valida = bcrypt.compareSync(contraseña, nuevo_usuario.contraseña);
        if(!contraseña_valida) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });
        }
        
        // Generar JWT
        const token = await generarJWT( nuevo_usuario.id, nuevo_usuario.nombre );


        res.status(200).json({
            ok: true,
            uid: nuevo_usuario.id,
            nombre: nuevo_usuario.nombre,
            token
        });
    } catch {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }
}

const revalidarToken = async(req, res = express.response) => {

    const uid = req.uid;
    const nombre = req.nombre;

    // Generar JWT
    const token = await generarJWT( uid, nombre );

    res.json({
        ok: true,
        uid, nombre,
        token
    });
}

const getById = async(req, res = express.response) => {
    
    try {

        const uid = req.params.id;
        const usuario = await Usuario.findById(uid);


        res.json({
            ok: true,
            usuario
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, 
            msg: 'Por favor hable con el administrador'
        });
    }
    
}

const deleteById = async(req, res = express.response) => {
    
    try {

        const uid = req.params.id;
        const usuario = await Usuario.findByIdAndDelete(uid);


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

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
    getById,
    cambiarDatos,
    modificarContraseña,
    deleteById
}