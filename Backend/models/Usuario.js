const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    primer_apellido: {
        type: String,
        required: true
    },
    segundo_apellido: {
        type: String,
        required: true
    },
    fecha_nacimiento: {
        type: Date,
        required: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: true
    },
    localidad: {
        type: String,
        required: true
    },
    provincia: {
        type: String,
        required: true
    },
    codigo_postal: {
        type: Number,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    nif: {
        type: String,
        required: true,
        unique: true
    },
    telefono: {
        type: Number,
        required: true,
        unique: true
    },
    usuario: {
        type: String,
        required: true,
        unique: true
    },
    contraseña: {
        type: String,
        required: true
    },
    administrador: {
        type: Boolean,
        required: true
    },
    img: {
        type: String,
    }
});

module.exports = model('Usuario', UsuarioSchema);
