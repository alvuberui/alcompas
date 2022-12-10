const { Router }= require('express');
const router = Router();
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarCargo } = require('../middlewares/validar-cargo');
const { validarInstrumentos } = require('../middlewares/validar-instrumento');
const { validarVoz } = require('../middlewares/validar-voz');
const { crearPeticion, getPeticionesByUserId, aceptarPeticion, rechazarPeticion } = require('../controllers/peticiones');

    // Validar JWT
router.use( validarJWT, validarCampos);

    // Obtener peticiones de un usuario
router.get('/:userId', getPeticionesByUserId);

    // Aceptar petición
router.put('/aceptar/:id/:userId', aceptarPeticion);

    // Rechazar petición
router.put('/rechazar/:id/:userId', rechazarPeticion);

    // Crear peticion
router.post('/',
    [
        check('rol', 'El rol no es válido').notEmpty().custom( value => {
            const condicion1 = value == 'Presidente';
            const condicion2 = value == 'Archivero';
            const condicion3 = value == 'Músico'

            if(!condicion1 && !condicion2 && !condicion3) {
                throw new Error("El rol no es válido");
            }
        }),
        check('cargo', 'El cargo no es válido').custom( value => {
            if(value) {
                const condicion = validarCargo(value);

                if(!condicion) {
                    throw new Error("El cargo no es válido");
                }
            }
            return true;
        }),
        check('mensaje', 'El mensaje es obligatorio').notEmpty(),
        check('instrumento', 'El instrumento no es válido').custom(value => {
            if (value) {
                const condicion = validarInstrumentos(value);
                if(!condicion) {
                    throw new Error("El instrumento no es válido");
                }
            }
            return true;
        }),
        check('voz', 'La voz no es válida').custom(value => {
            if(value) {
                const condicion = validarVoz(value);
                if(!condicion) {
                    throw new Error("La voz no es válida");
                }
            }
            return true;
        }),
        check('usuario', 'El usuario es obligatorio').isMongoId(),
        check('banda', 'La banda es obligatoria').isMongoId(),
        check('directivo', 'El directivo es obligatorio').isMongoId()
    ],
    validarCampos,
    crearPeticion);

    
module.exports = router;  