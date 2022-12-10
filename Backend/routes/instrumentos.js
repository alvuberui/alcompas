const { Router }= require('express');
const router = Router();
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarInstrumentos } = require('../middlewares/validar-instrumento');
const { crearInstrumentoUsuario, getInstrumentosByUserId, eliminarInstrumento,
        actualizarInstrumentoUsuario,getinstrumentosById } = require('../controllers/instrumentos');

    // Validar JWT
router.use( validarJWT, validarCampos);

    // Obtener instrumentos de un usuario
router.get('/instrumentosByUserId/:userId', getInstrumentosByUserId);

    // Obtener instrumento
router.get('/instrumentosById/:instrumentoId', getinstrumentosById);

    // Crear instrumento usuario
router.post('/usuario',
    [
        check('instrumento', 'El instrumento no es válido').custom(value => {
            if (value) {
                const condicion = validarInstrumentos(value);
                if(!condicion) {
                    throw new Error("El instrumento no es válido");
                }
            }
            return true;
        }),
        check('modelo', 'El modelo no puede tener más de 50 caracteres').isLength({max: 50}),
        check('numeroSerie', 'El número de serie no puede tener más de 50 caracteres').isLength({max: 50}),
        check('marca', 'La marca no puede tener más de 50 caracteres').isLength({max: 50}),
        check('usuario', 'El usuario es obligatorio').isMongoId(),

    ],
    validarCampos,
    crearInstrumentoUsuario);

    // Editar instrumento usuario
    router.put('/usuario/:instrumentoId',
    [
        check('instrumento', 'El instrumento no es válido').custom(value => {
            if (value) {
                const condicion = validarInstrumentos(value);
                if(!condicion) {
                    throw new Error("El instrumento no es válido");
                }
            }
            return true;
        }),
        check('modelo', 'El modelo no puede tener más de 50 caracteres').isLength({max: 50}),
        check('numeroSerie', 'El número de serie no puede tener más de 50 caracteres').isLength({max: 50}),
        check('marca', 'La marca no puede tener más de 50 caracteres').isLength({max: 50}),
        check('usuario', 'El usuario es obligatorio').isMongoId(),
    ],
    validarCampos,
    actualizarInstrumentoUsuario);

router.delete('/:instrumentoId', eliminarInstrumento); 

module.exports = router;  