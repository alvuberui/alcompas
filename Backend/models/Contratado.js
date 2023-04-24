const { Schema, model } = require('mongoose');

const ContratadoSchema = Schema({
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
    tipo: {
        type: String,
        enum: [ 'Procesion', 'Actuacion', 'Ensayo' ],
        require: true
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

module.exports = model('Contratado', ContratadoSchema);