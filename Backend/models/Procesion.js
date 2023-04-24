const { Schema, model } = require('mongoose');

const ProcesionSchema = Schema({
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
    costes: {
        type: Number,
        required: true,
    },
    beneficios: {
        type: Number,
        required: true,
    },
    comentarioEconomico: {
        type: String,
    },
    dia: {
        type: String,
        enum: ['Viernes Dolores', 'Sábado de Pasión', 'Domingo de Resurreción', 'Lunes Santo',
         'Martes Santo', 'Miércoles Santo', 'Jueves Santo', 'Viernes Santo', 'Sábado Santo', 'Domingo de Ramos'],
    },
    tipo: {
        type: String,
        enum: ['Gloria', 'Semana Santa'],
    },
    fechaSalida: {
        type: Date,
        required: true,
    },
    lugarSalida: {
        type: String,
        required: true,
    },
    bocadillo: {
        type: Boolean,
        required: true,
    },
    hermandad: {
        type: String,
        required: true,
    },
    nombreTitular: {
        type: String,
        required: true,
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

module.exports = model('ProcesionSchema', ProcesionSchema);