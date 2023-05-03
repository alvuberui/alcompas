const { Schema, model } = require('mongoose');

const PrestamoSchema = Schema({
    fechaInicio: {
        type: Date,
        required: true, 
    },
    fechaInicio: {
        type: Date,
    },
    estado: {
        type: String,
        required: true,
        enum: ['Activo', 'Finalizado']
    },
    comentario: {
        type: String,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    tipo: {
        type: String,
        required: true,
        enum: ['Vestimenta', 'Instrumento']
    },
    referencia: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

module.exports = model('Prestamo', PrestamoSchema);