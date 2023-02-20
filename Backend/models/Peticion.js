const { Schema, model} = require('mongoose');

const PeticionSchema = Schema({
    fecha: {
        type: Date,
        required: true
    },
    rol: {
        type: String,
        enum: ['Directivo', 'Músico', 'Archivero'],
        required: true
    },
    cargo: {
        type: String,
        enum: ['Presidente', 'Vicepresidente', 'Tesorero', 'Secretario', 'Vocal', 'Representante', 'Manager', 'Director', 'Subdirector'],
    },
    mensaje: {
        type: String,
        required: true,
    },
    instrumento: {
        type: String,
        enum: ['Corneta', 'Tambor', 'Bordonera', 'Caja', 'Bombo', 'Platos',
        'Percusionista', 'Tuba', 'Trombón', 'Bombardino', 'Trompa',
        'Fliscorno', 'Trompeta', 'Saxofón Alto', 'Saxofón Tenor', 
        'Saxofón Barítono', 'Clarinete', 'Flauta', 'Flautín', 'Oboe',
        'Fagot', 'Lira', 'Campana', 'Cascabeles', 'Batería', 'Xilófono',
        'Timbales', 'Campanilla', 'Clarinete Bajo', 'Requinto']
    },
    voz: {
        type: String,
        enum: ['Principal', 'Primero', 'Segundo', 'Tercero']
    },
    estado: {
        type: String,
        enum: ['Aceptada', 'Denegada', 'Pendiente'],
        required: true
    },
    banda: {
        type: Schema.Types.ObjectId,
        ref: 'Banda',
        required: true
    },
    directivo: {
        type: Schema.Types.ObjectId,
        ref: 'Directivo',
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

module.exports = model('Peticion', PeticionSchema);