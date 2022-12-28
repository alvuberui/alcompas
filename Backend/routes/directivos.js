const { Router }= require('express');
const router = Router();
const { check } = require('express-validator');

const { crearDirectivo, finalizarDirectivo, eliminarDirectivos, getDirectivoById, getDirectivoByUserId } = require('../controllers/directivos');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

/*
* Aquí se configuran todas la rutas de /api/directivos
*/
router.use( validarJWT );

 // Crear directivo
router.post(
    '/',
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
        check('cargo', 'El cargo es obligatorio').not().isEmpty(),
        check('fecha_final', 'La fecha final no es válida').isEmpty(),
        check('banda', 'La banda es obligatoria').not().isEmpty(),
        validarCampos
    ],
    crearDirectivo);

    // Finalizar rol de directivo
router.put('/:id', finalizarDirectivo);

    // Eliminar todos los roles de directivo de un usuario
router.delete('/:id', eliminarDirectivos);

    // Obtener un directivo a través de su id
router.get('/:id', getDirectivoById);

    // Obtener un directivo a través de su userId
router.get('/byUserId/:id', getDirectivoByUserId);



module.exports = router;