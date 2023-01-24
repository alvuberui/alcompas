const { Router }= require('express');
const router = Router();
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { getComentarioByBandaId, crearComentario, eliminarComentario } = require('../controllers/comentarios');


    // Validar JWT
router.use( validarJWT, validarCampos);

    // Obtener comentarios asignados a una banda
router.get('/:bandaId', getComentarioByBandaId);

  // Crear comentario
router.post('/',
    check('titulo', 'El título es obligatorio').isLength({min:1, max:25}),
    check('texto', 'El texto debe contener entre 1 y 500 caracteres').isLength({min:1, max:500}),
    check('banda', 'La banda es obligatoria').isMongoId(),
    check('usuario', 'El usuario es obligatorio').isMongoId(),
    validarCampos,
    crearComentario); 

router.delete('/:comentarioId', eliminarComentario); 

    
module.exports = router;  