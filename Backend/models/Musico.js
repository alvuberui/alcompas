const { Schema, model, trusted } = require('mongoose');

const MusicoSchema = Schema({
    fecha_inicio: {
        type: Date,
        required: true
    },
    instrumento: {
        type: String,
        enum: ['Corneta', 'Tambor', 'Bordonera', 'Caja', 'Bombo', 'Platos',
        'Percusionista', 'Tuba', 'Trombón', 'Bombardino', 'Trompa',
        'Fliscorno', 'Trompeta', 'Saxofón Alto', 'Saxofón Tenor', 
        'Saxofón Barítono', 'Clarinete', 'Flauta', 'Flautín', 'Oboe',
        'Fagot', 'Lira', 'Campana', 'Cascabeles', 'Batería', 'Xilófono',
        'Timbales', 'Campanilla', 'Clarinete Bajo', 'Requinto'],
        required: true
    },
    voz: {
        type: String,
        enum: ['Primero', 'Segundo', 'Tercero'],
        required: true
    },
    fecha_final: {
        type: Date,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

module.exports = model('Musico', MusicoSchema);