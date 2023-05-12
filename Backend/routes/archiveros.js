const { Router }= require('express');
const router = Router();
const { check } = require('express-validator');
const { finalizarArchivero, eliminarArchiveros, getArchiveroByUserId, esArchiveroByBandaId, obtenerArchiverosByBanda} = require('../controllers/archiveros');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

/*
* Aquí se configuran todas la rutas de /api/archiveros
*/
router.use( validarJWT );

   // Finalizar rol de archivero
router.put('/:userId/:bandaId', finalizarArchivero);

   // Obtener archiveros a través del usuario id
router.get('/usuario/id/:userId', getArchiveroByUserId);

// Es archivero de una banda 
router.get('/banda/:bandaId', esArchiveroByBandaId);

// Obtener archivero de una banda
router.get('/archivero/banda/:bandaId', obtenerArchiverosByBanda);


module.exports = router;    