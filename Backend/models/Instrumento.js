const { Schema, model} = require('mongoose');

const InstrumentoSchema = Schema({
    modelo: {
        type: String,
    },
    instrumento: {
        type: String,
        required: true,
        enum: ['Corneta', 'Tambor', 'Bordonera', 'Caja', 'Bombo', 'Platos',
        'Percusionista', 'Tuba', 'Trombón', 'Bombardino', 'Trompa',
        'Fliscorno', 'Trompeta', 'Saxofón Alto', 'Saxofón Tenor', 
        'Saxofón Barítono', 'Clarinete', 'Flauta', 'Flautín', 'Oboe',
        'Fagot', 'Lira', 'Campana', 'Cascabeles', 'Batería', 'Xilófono',
        'Timbales', 'Campanilla', 'Clarinete Bajo', 'Requinto']
    },
    marca: {
        type: String,
    },
    numeroSerie: {
        type: String,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

module.exports = model('Instrumento', InstrumentoSchema);