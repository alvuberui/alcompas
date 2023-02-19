const { Schema, model } = require('mongoose');

const RedSocialSchema = Schema({
    nombre: {
        type: String,
        required: true, 
    },
    url: {
        type: String,
        required: true,
    },
    banda: {
        type: Schema.Types.ObjectId,
        ref: 'Banda',
        required: true
    }
});

module.exports = model('RedSocial', RedSocialSchema);