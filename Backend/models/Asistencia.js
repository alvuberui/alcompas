const { Schema, model } = require('mongoose');

const AsistenciaSchema = Schema({
    respuesta: {
        type: String,
        enum: [ 'Asisto', 'No asisto' ],
        require: true
    },
    tipo: {
        type: String,
        enum: [ 'Procesion', 'Actuacion', 'Ensayo' ],
        require: true
    },
    comentario: {
        type: String,
        required: false
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    referencia: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

module.exports = model('Asistencia', AsistenciaSchema);