const express = require('express');
const Banda = require('../models/Banda');

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

        banda = new Banda(req.body);
        await banda.save();
        res.status(201).json({
            ok: true,
            nombre,
            tipo_banda,
            cif
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

    try {
        const banda = Banda.findById(bandaId);
        await Banda.deleteOne(banda);
        res.status(201).json({
            ok: true,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: error.codeName
        });
    }
    

}

module.exports = {
    crearBanda,
    actualizar_banda,
    eliminar_banda
}