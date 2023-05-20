const { Schema, model } = require('mongoose');

const RepertorioSchema = Schema({
    titulo: {
        type: String,
        required: true, 
    },
    descripcion: {
        type: String,
    },
    banda: {
        type: Schema.Types.ObjectId,
        ref: 'Banda',
        required: true
    }
});

module.exports = model('Repertorio', RepertorioSchema);