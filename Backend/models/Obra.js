const { Schema, model } = require('mongoose');

const ObraSchema = Schema({
    titulo: {
        type: String,
        required: true, 
    },
    compositor: {
        type: String,
        required: true
    },
    repertorio: {
        type: Schema.Types.ObjectId,
        ref: 'Repertorio',
        required: true
    }
});

module.exports = model('Obra', ObraSchema);