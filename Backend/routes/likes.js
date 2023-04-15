const { Router }= require('express');
const router = Router();
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { publicarLike, publicarDislike, getLikeByTipoAndReferencia,
        getNumeroDeLikes } = require('../controllers/likes');

    // Validar JWT
router.use( validarJWT, validarCampos);

// Publicar like
router.post('/',
    [
        check('tipo', 'La referencia no es válida').notEmpty().custom( value => {
            const lista = ['Banda', 'Comentario', 'Procesion', 'Ensayo', 'Actuacion', 'Banda', 'Noticia'];
            if(!lista.includes(value)) {
                throw new Error("La referencia no es válida");
            }
            return true;
        }),
        check('referencia', 'La referencia no es válida').isMongoId(),
        check('usuario', 'El usuario no es válido').isMongoId(),
    ],
    validarCampos,
    publicarLike);

// Eliminar un like publicado
router.delete('/tipo/:tipo/referencia/:referencia', publicarDislike);

// Obtener si un usuario ha dado like a una entidad concreta (instancia)
router.get('/tipo/:tipo/referencia/:referencia', getLikeByTipoAndReferencia);

// Obtener el numero de likes de un evento
router.get('/numero/tipo/:tipo/referencia/:referencia', getNumeroDeLikes);

module.exports = router;