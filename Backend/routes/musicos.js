const { Router }= require('express');
const router = Router();
const { check } = require('express-validator');

const { crearMusico, finalizarMusico, eliminarMusicos } = require('../controllers/musicos');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarInstrumentos } = require('../middlewares/validar-instrumento');
const { validarVoz } = require('../middlewares/validar-voz');
const { validarJWT } = require('../middlewares/validar-jwt');

/*
* Aquí se configuran todas la rutas de /api/directivos
*/
router.use( validarJWT );

    // Crear un músico:
router.post('/',
    [
        check('fecha_inicio', 'La fecha de inicio no es válida').isISO8601().toDate().custom( value => {
            let fecha_entrada = new Date(value)
            let fecha_actual = new Date()
            
            if( fecha_actual.getDate() != fecha_entrada.getDate() 
                || fecha_actual.getMonth() != fecha_entrada.getMonth() 
                || fecha_actual.getFullYear() != fecha_entrada.getFullYear() ) {
                throw new Error("La fecha de inicio no es la actual");
            }
            return true;
        }),
        check('fecha_final', "La fecha final no debe estar definida").isEmpty(),
        check('instrumento', "El instrumento es obligatorio").not().isEmpty().custom( value => {
            const esValido = validarInstrumentos(value);
            if(esValido == false) {
                throw new Error("El instrumento no es válido");
            }
            return true;
        }),
        check('voz', "La voz es obligatoria").not().isEmpty().custom( value => {
            const esValido = validarVoz(value);
            if(esValido == false) {
                throw new Error("La voz no es válida");
            }
            return true;
        }),
        check('banda', 'La banda es obligatoria').not().isEmpty(),
        validarCampos
    ],
    crearMusico);

    // Finalizar rol de músico
router.put('/finalizar/:userId/:bandaId', finalizarMusico);

    // Eliminar músicos
router.delete('/:id', eliminarMusicos);

module.exports = router;    