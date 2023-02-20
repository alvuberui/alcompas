const { Router }= require('express');
const router = Router();
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearEstudio, getEstudiosByUserId, eliminarEstudioById, editarEstudio,
            getEstudioById } = require('../controllers/estudios');

    // Validar JWT
router.use( validarJWT, validarCampos);

    // Obtener estudios de un usuario
router.get('/estudiosByUserId/:userId', getEstudiosByUserId);

// Obtener estudio por la Id
router.get('/estudioById/:estudioId', getEstudioById);

    // Eliminar estudio
router.delete('/eliminarById/:estudioId', eliminarEstudioById);


// Crear estudio
router.post('/',
    [
        check('tipoEstudio', 'El tipo de estudio no es válido').notEmpty().custom( value => {
            const lista = ['Grado elemental', 'Grado medio', 'Grado superior', 'Curso', 'Autodidacta', 'Otro'];
            if(!lista.includes(value)) {
                throw new Error("El estudio no es válido");
            }
            return true;
        }),
        check('centroEstudios', 'El centro de estudios no es válido').isLength({max: 50}),
        check('poblacion', 'La población es no puede tener más de 50 caracteres').isLength({max: 50}),
        check('provincia', 'La provincia no puede tener más de 50 caracteres').isLength({max: 50}),
        check('fechaInicio', 'La fecha de inicio no es válida').notEmpty().custom( value => {
            const fecha = new Date(value);
            if(fecha > new Date()) {
                throw new Error("La fecha de inicio no puede ser mayor que la fecha actual");
            }
            return true;
        }),
        check('usuario', 'El usuario es obligatorio').isMongoId(),
    ],
    validarCampos,
    crearEstudio);

// Editar estudio
router.put('/:estudioId',
    [
        check('tipoEstudio', 'El tipo de estudio no es válido').notEmpty().custom( value => {
            const lista = ['Grado elemental', 'Grado medio', 'Grado superior', 'Curso', 'Autodidacta', 'Otro'];
            if(!lista.includes(value)) {
                throw new Error("El estudio no es válido");
            }
            return true;
        }),
        check('centroEstudios', 'El centro de estudios no es válido').isLength({max: 50}),
        check('poblacion', 'La población es no puede tener más de 50 caracteres').isLength({max: 50}),
        check('provincia', 'La provincia no puede tener más de 50 caracteres').isLength({max: 50}),
        check('fechaInicio', 'La fecha de inicio no es válida').notEmpty().custom( value => {
            const fecha = new Date(value);
            if(fecha > new Date()) {
                throw new Error("La fecha de inicio no puede ser mayor que la fecha actual");
            }
            return true;
        }),
        check('usuario', 'El usuario es obligatorio').isMongoId(),
    ],
    validarCampos,
    editarEstudio);


module.exports = router;  