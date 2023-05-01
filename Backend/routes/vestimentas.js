const { Router }= require('express');
const router = Router();
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearVestimenta, getTodasVestimentasByBanda, editarVestimenta, eliminarVestimenta} = require('../controllers/vestimentas');


    // Validar JWT
    router.use( validarJWT, validarCampos);

// Crear vestiementa
router.post('/',
    [
        check('tipo', 'El tipo de vestimenta no es válido').custom(value => {
            const tipos = ['Camisa', 'Pantalones', 'Chaqueta', 'Corbata', 'Gorro', 'Polo'];
            return tipos.includes(value);
        }),
        check('banda', 'El usuario es obligatorio').isMongoId(),

    ],
    validarCampos, 
    crearVestimenta
    );

// Editar vestimenta
router.put('/:id',
    [
        check('tipo', 'El tipo de vestimenta no es válido').custom(value => {
            const tipos = ['Camisa', 'Pantalones', 'Chaqueta', 'Corbata', 'Gorro', 'Polo'];
            return tipos.includes(value);
        }),
        check('banda', 'El usuario es obligatorio').isMongoId(),

    ],
    validarCampos, 
    editarVestimenta
    );

// Eliminar vestimenta
router.delete('/:id', eliminarVestimenta);


// Obtener todas las vestimentas de una banda
router.get('/banda/:banda', getTodasVestimentasByBanda);


module.exports = router;  