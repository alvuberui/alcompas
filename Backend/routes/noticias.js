const { Router }= require('express');
const router = Router();
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearNoticia, getDestacadas } = require('../controllers/noticias');

// Validar JWT
router.use( validarJWT, validarCampos);

// Crear noticia
router.post('/',
    [
        check('privacidad', 'La privacidad no es válida').notEmpty().custom( value => {
            const lista = ['Pública', 'Privada', 'Restringida'];
            if(!lista.includes(value)) {
                throw new Error("La privacidad de la noticia no es válida");
            }
            return true;
        }),
        check('titulo', 'El titulo debe contener entre 1 y 75 caracteres').isLength({min:1, max: 75}),
        check('descripcion', 'La descripcion debe de contener entre 1 y 2000').isLength({min:1, max: 2000}),
        check('privacidad', 'La provincia no puede tener más de 50 caracteres').notEmpty(),
        check('banda', 'La banda no es válida').isMongoId(),
    ],
    validarCampos,
    crearNoticia);

    // Obtener estudios de un usuario
router.get('/destacadas', getDestacadas);



module.exports = router;  