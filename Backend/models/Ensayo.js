const { Schema, model } = require('mongoose');

const EnsayoSchema = Schema({
    titulo: {
        type: String,
        required: true, 
    },
    descripcion: {
        type: String,
    },
    fechaInicio: {
        type: Date,
        required: true,
    },
    fechaFin: {
        type: Date,
        required: true,
    },
    lugar: {
        type: String,
        required: true,
    },
    tematica: {
        type: String,
        required: true,
    },
    banda: {
        type: Schema.Types.ObjectId,
        ref: 'Banda',
        required: true
    }
});

module.exports = model('Ensayo', EnsayoSchema);