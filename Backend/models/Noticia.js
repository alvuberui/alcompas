const { Schema, model } = require('mongoose');

const NoticiaSchema = Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    privacidad: {
        type: String,
        enum: ['Pública', 'Privada', 'Restringida'],
        required: true
    },
    banda: {
        type: Schema.Types.ObjectId,
        ref: 'Banda',
        required: true
    }
});

module.exports = model('Noticia', NoticiaSchema);