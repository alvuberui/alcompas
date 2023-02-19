const { Router }= require('express');
const router = Router();
const { check } = require('express-validator');

const { crearDirectivo, finalizarDirectivo, eliminarDirectivos, getDirectivoById, getDirectivoByUserId,
        getDirectivoByBandaId} = require('../controllers/directivos');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

/*
* Aquí se configuran todas la rutas de /api/directivos
*/
router.use( validarJWT );


    // Finalizar rol de directivo
router.put('/finalizar/:userId/:bandaId', finalizarDirectivo);

    // Obtener un directivo a través de su id
router.get('/:id', getDirectivoById);

    // Obtener un directivo a través de su userId
router.get('/byUserId/:id', getDirectivoByUserId);

    // Obtener todos los directivos de una banda
router.get('/banda/id/:id', getDirectivoByBandaId);



module.exports = router;