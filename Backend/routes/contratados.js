const { Router }= require('express');
const router = Router();
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearContratado, getContratadosByEvento, eliminarContratado } = require('../controllers/contratados');

const lista = ['Corneta', 'Tambor', 'Bordonera', 'Caja', 'Bombo', 'Platos',
'Percusionista', 'Tuba', 'Trombón', 'Bombardino', 'Trompa',
'Fliscorno', 'Trompeta', 'Saxofón Alto', 'Saxofón Tenor', 
'Saxofón Barítono', 'Clarinete', 'Flauta', 'Flautín', 'Oboe',
'Fagot', 'Lira', 'Campana', 'Cascabeles', 'Batería', 'Xilófono',
'Timbales', 'Campanilla', 'Clarinete Bajo', 'Requinto']
    // Validar JWT
router.use( validarJWT, validarCampos);

// Crear estudio
router.post('/',
    [
        check('tipo', 'El tipo de transacción no es válido').notEmpty().custom( value => {
            const lista = ['Procesion', 'Actuacion', 'Ensayo'];
            if(!lista.includes(value)) {
                throw new Error("La transacción no es válido");
            }
            return true;
        }),
        check('instrumento', 'El instrumento no es válido').notEmpty().custom( value => {
           if( !lista.includes(value)) {
                throw new Error("El instrumento no es válido"); 
           }
           return true;
        }),
        check('referencia', 'La referencia es obligatoria').isMongoId(),
        check('usuario', 'El usuario').isMongoId(),
    ],
    validarCampos,
    crearContratado);

// Obtener contratados de un evento
router.get('/evento/:tipo/:referencia', getContratadosByEvento);

// Eliminar contratado
router.delete('/:id', eliminarContratado);

module.exports = router;