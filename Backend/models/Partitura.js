const { Schema, model } = require('mongoose');

const PartituraSchema = Schema({
    url: {
        type: String,
        required: true, 
    },
    instrumento: {
        type: String,
        enum: ['Corneta', 'Tambor', 'Bordonera', 'Caja', 'Bombo', 'Platos',
        'Percusionista', 'Tuba', 'Trombón', 'Bombardino', 'Trompa',
        'Fliscorno', 'Trompeta', 'Saxofón Alto', 'Saxofón Tenor', 
        'Saxofón Barítono', 'Clarinete', 'Flauta', 'Flautín', 'Oboe',
        'Fagot', 'Lira', 'Campana', 'Cascabeles', 'Batería', 'Xilófono',
        'Timbales', 'Campanilla', 'Clarinete Bajo', 'Requinto', 'Director'],
        required: true
    },
    voz: {
        type: String,
        enum: ['Primero', 'Segundo', 'Tercero'],
        required: true
    },
    obra: {
        type: Schema.Types.ObjectId,
        ref: 'Obra',
        required: true
    }
});

module.exports = model('Partitura', PartituraSchema);