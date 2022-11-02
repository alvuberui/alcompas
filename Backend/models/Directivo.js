const { Schema, model, trusted } = require('mongoose');

const DirectivoSchema = Schema({
    fecha_inicio: {
        type: Date,
        required: true
    },
    cargo: {
        type: String,
        enum: ['Presidente', 'Vicepresidente', 'Tesorero', 'Secretario', 'Vocal', 'Representante', 'Manager', 'Director', 'Subdirector'],
        required: true
    },
    fecha_final: {
        type: Date,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    banda: {
        type: Schema.Types.ObjectId,
        ref: 'Banda',
        required: true
    }
});

module.exports = model('Directivo', DirectivoSchema);