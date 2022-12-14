const { Schema, model } = require('mongoose');

const ArchiveroSchema = Schema({
    fecha_inicio: {
        type: Date,
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

module.exports = model('Archivero', ArchiveroSchema);