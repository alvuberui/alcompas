const { Schema, model } = require('mongoose');

const PrestamoSchema = Schema({
    fechaInicio: {
        type: Date,
        required: true, 
    },
    fechaFin: {
        type: Date,
    },
    estado: {
        type: Date,
        required: true,
        enum: ['Activo', 'Finalizado', 'Cancelado']
    },
    comentario: {
        type: String,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    estado: {
        type: Date,
        required: true,
        enum: ['Vestimenta', 'Instrumento']
    },
    referencia: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

module.exports = model('Prestamo', PrestamoSchema);