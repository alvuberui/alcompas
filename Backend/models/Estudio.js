const { Schema, model } = require('mongoose');

const EstudioSchema = Schema({
    tipoEstudio: {
        type: String,
        enum: ['Grado elemental', 'Grado medio', 'Grado superior', 'Curso', 'Autodidacta', 'Otro'],
        required: true
    },
    centroEstudios: {
        type: String,
    },
    poblacion: {
        type: String,
    },
    provincia: {
        type: String,
    },
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: {
        type: Date,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

module.exports = model('Estudio', EstudioSchema);