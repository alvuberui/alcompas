const { Schema, model, trusted } = require('mongoose');

const BandaSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    tipo_banda: {
        type: String,
        enum: ['Agrupación Musical', 'Banda de Cornetas y Tambores', 'Banda de Música' ],
        require: true
    },
    localidad: {
        type: String,
        required: true,
    },
    provincia: {
        type: String,
        required: trusted,
    },
    codigo_postal: {
        type: Number,
        required: true,
    },
    direccion: {
        type: String,
        required: true,
    },
    año_fundacion: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        required: true,
    },
    telefono: {
        type: Number,
        required: true,
        unique: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    cif: {
        type: String,
        required: true,
        unique: true,
    }
});

module.exports = model('Banda', BandaSchema);