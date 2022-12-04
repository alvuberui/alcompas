const { Schema, model } = require('mongoose');

const ComentarioSchema = Schema({
    texto: {
        type: String,
        required: true, 
    },
    titulo: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        required: true,
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

module.exports = model('Comentario', ComentarioSchema);