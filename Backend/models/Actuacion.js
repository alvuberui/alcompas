const { Schema, model } = require('mongoose');

const ActuacionSchema = Schema({
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
    localidad: {
        type: String,
        required: true,
    },
    provincia: {
        type: String,
        required: true,
    },
    lugar: {
        type: String,
        required: true,
    },
    tipoActuacion: {  // NO ESTÁ
        type: String,
        enum: ['Concierto', 'Encuentro de Bandas', 'Corrida de Toros', 'Pasacalles'],
    },
    fechaSalida: {
        type: String,
        required: true,
    },
    lugarSalida: {
        type: String,
        required: true,
    },
    beneficios: {
        type: Number,
        required: true,
    },
    costes: {
        type: Number,
        required: true,
    },
    comentarioEconomico: {
        type: String,
    },
    banda: {
        type: Schema.Types.ObjectId,
        ref: 'Banda',
        required: true
    },
    transaccion: {
        type: Schema.Types.ObjectId,
        ref: 'Transaccion',
        required: true
    }
});

module.exports = model('Actuacion', ActuacionSchema);