const { Schema, model} = require('mongoose');

const VestimentaSchema = Schema({
    tipo: {
        type: String,
        type: String,
        required: true,
        enum: ['Camisa', 'Pantalones', 'Chaqueta', 'Corbata', 'Gorro', 'Polo']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    banda: {
        type: Schema.Types.ObjectId,
        ref: 'Banda',
        required: true,
    }
});

module.exports = model('Vestimenta', VestimentaSchema);