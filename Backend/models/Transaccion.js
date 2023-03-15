const { Schema, model } = require('mongoose');

const TransaccionSchema = Schema({
    cantidad: {
        type: Number,
        required: true
    },
    motivo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
    },
    fecha: {
        type: Date,
        required: true
    },
    tipo: {
        type: String,
        enum: ['Beneficio', 'Gasto'],
        required: true
    },
    banda: {
        type: Schema.Types.ObjectId,
        ref: 'Banda',
        required: true
    }
});

module.exports = model('Transaccion', TransaccionSchema);