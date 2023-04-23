const { Router }= require('express');
const router = Router();
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { getBandasConMasContratos, getBandasConMasContratosSemanaSanta, getBandasPopulares } = require('../controllers/estadisticas');

// Validar JWT
router.use( validarJWT, validarCampos);

// Obtener bandas con mas contratos
router.get('/contratos', getBandasConMasContratos);

// Obtener bandas con mas contratos semana santa
router.get('/contratos/semana-santa', getBandasConMasContratosSemanaSanta);

// Obtener bandas con mas likes
router.get('/likes', getBandasPopulares);

module.exports = router;

