const { Router }= require('express');
const router = Router();
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearTransaccion, getByBanda, actualizarTransaccion, deleteById} = require('../controllers/transacciones');

    // Validar JWT
router.use( validarJWT, validarCampos);

// Crear estudio
router.post('/',
    [
        check('tipo', 'El tipo de transacción no es válido').notEmpty().custom( value => {
            const lista = ['Beneficio', 'Gasto'];
            if(!lista.includes(value)) {
                throw new Error("La transacción no es válido");
            }
            return true;
        }),
        check('cantidad', 'La cantidad no es válida').isFloat(),
        check('motivo', 'El motivo debe de contener entre 1 y 50 caracteres').isLength({min: 1,max: 50}),
        check('descripcion', 'La descripción debe contener como máximo 500 caracteres').isLength({max: 500}),
        check('fecha', 'La fecha de inicio no es válida').isISO8601().toDate(),
        check('banda', 'La banda es obligatoria').isMongoId(),
    ],
    validarCampos,
    crearTransaccion);

// Actualizar transaccion
router.put('/:transaccionId',
    [
        check('tipo', 'El tipo de transacción no es válido').notEmpty().custom( value => {
            const lista = ['Beneficio', 'Gasto'];
            if(!lista.includes(value)) {
                throw new Error("La transacción no es válido");
            }
            return true;
        }),
        check('cantidad', 'La cantidad no es válida').isFloat(),
        check('motivo', 'El motivo debe de contener entre 1 y 50 caracteres').isLength({min: 1,max: 50}),
        check('descripcion', 'La descripción debe contener como máximo 500 caracteres').isLength({max: 500}),
        check('fecha', 'La fecha de inicio no es válida').isISO8601().toDate(),
        check('banda', 'La banda es obligatoria').isMongoId(),
    ],
    validarCampos,
    actualizarTransaccion);

// Ordenadas por fecha
router.get('/banda/:bandaId', getByBanda);

router.delete('/:transaccionId', deleteById);

module.exports = router;