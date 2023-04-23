const { Schema, model } = require('mongoose');

const LikeSchema = Schema({
    fecha: {
        type: Date,
        required: true, 
    },
    tipo: {
        type: String,
        required: true, 
        enum: ['Banda', 'Comentario', 'Procesion', 'Ensayo', 'Actuacion', 'Banda', 'Noticia']
    },
    referencia: {
        type: Schema.Types.ObjectId,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
    
});

module.exports = model('Like', LikeSchema);