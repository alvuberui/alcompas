const { Router }= require('express');
const router = Router();
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearProcesion, crearActuacion, crearEnsayo } = require('../controllers/eventos');

const dias = ['Viernes Dolores', 'Sábado de Pasión', 'Domingo de Resurreción', 'Lunes Santo',
'Martes Santo', 'Miércoles Santo', 'Jueves Santo', 'Viernes Santo', 'Sábado Santo', 'Domingo de Ramos'];
const tipos = ['Gloria', 'Semana Santa'];
const tipoActuacion = ['Concierto', 'Encuentro de Bandas', 'Corrida de Toros', 'Pasacalles'];
    // Validar JWT
router.use( validarJWT, validarCampos);

// Operaciones sobre procesiones
router.post('/procesion',
    [   
        check('titulo', 'El título debe contener entre 1 y 50 caracteres').isLength({min:1, max: 50}),
        check('descripcion', 'La descripción debe de contener como máximo 2000 caracteres').isLength({max: 2000}),
        check('fechaInicio', 'La fecha tiene que ser futura').isISO8601().toDate().custom( value => {
            const fecha = new Date(value);
            if(fecha < new Date()) {
                throw new Error("La fecha de inicio no puede ser menor que la fecha actual");
            }
            return true;
        }),
        check('fechaFin', 'La fecha tiene que ser futura').isISO8601().toDate().custom( value => {
            const fecha = new Date(value);
            if(fecha < new Date()) {
                throw new Error("La fecha de fin no puede ser menor que la fecha actual");
            }
            return true;
        }),
        check('comentarioEconomico', 'El comentario económico debe de contener como máximo 2000 caracteres').isLength({max: 1000}),
        check('localidad', 'La localidad debe contener entre 1 y 20 caracteres').isLength({min:1, max: 20}),
        check('provincia', 'La provincia debe contener entre 1 y 20 caracteres').isLength({min:1, max: 20}),
        check('lugar', 'El lugar debe contener entre 1 y 50 caracteres').isLength({min:1, max: 50}),
        check('costes', 'Los costes deben ser un número').isNumeric(),
        check('beneficios', 'Los beneficios deben ser un número').isNumeric(),
        check('dia', 'El día no es válido').not().isEmpty().custom(value => {
            if(!dias.includes(value)) {
                throw new Error("El día no es válido");
            }
            return true;
        }),
        check('tipo', 'El tipo debe ser un número').not().isEmpty().custom(value => {
            if(!tipos.includes(value)) {
                throw new Error("El tipo no es válido");
            }
            return true;
        }),
        check('fechaSalida', 'La fecha de salida es inválida').isISO8601().toDate().custom( value => {
            const fecha = new Date(value);
            if(fecha < new Date()) {
                throw new Error("La fecha de salida no puede ser menor que la fecha actual");
            }
            return true;
        }),
        check('lugarSalida', 'El lugar de salida debe contener entre 1 y 50 caracteres').isLength({min:1, max: 50}),
        check('bocadillo', 'El bocadillo debe ser un booleano').isBoolean(),
        check('hermandad', 'La debe contener entre 1 y 50 caracteres').isLength({min:1, max: 100}),
        check('nombreTitular', 'El nombre del titular debe contener entre 1 y 50 caracteres').isLength({min:1, max: 50}),
        check('banda', 'La banda es inválida').isMongoId(),
        
    ],
    validarCampos,
    crearProcesion);

// Operaciones sobre actuaciones
router.post('/actuacion',
    [   
        check('titulo', 'El título debe contener entre 1 y 50 caracteres').isLength({min:1, max: 50}),
        check('descripcion', 'La descripción debe de contener como máximo 2000 caracteres').isLength({max: 2000}),
        check('fechaInicio', 'La fecha tiene que ser futura').isISO8601().toDate().custom( value => {
            const fecha = new Date(value);
            if(fecha < new Date()) {
                throw new Error("La fecha de inicio no puede ser menor que la fecha actual");
            }
            return true;
        }),
        check('fechaFin', 'La fecha tiene que ser futura').isISO8601().toDate().custom( value => {
            const fecha = new Date(value);
            if(fecha < new Date()) {
                throw new Error("La fecha de fin no puede ser menor que la fecha actual");
            }
            return true;
        }),
        check('comentarioEconomico', 'El comentario económico debe de contener como máximo 2000 caracteres').isLength({max: 1000}),
        check('localidad', 'La localidad debe contener entre 1 y 20 caracteres').isLength({min:1, max: 20}),
        check('provincia', 'La provincia debe contener entre 1 y 20 caracteres').isLength({min:1, max: 20}),
        check('lugar', 'El lugar debe contener entre 1 y 50 caracteres').isLength({min:1, max: 50}),
        check('costes', 'Los costes deben ser un número').isNumeric(),
        check('beneficios', 'Los beneficios deben ser un número').isNumeric(),
        check('dia', 'El día no es válido').not().isEmpty().custom(value => {
            if(!dias.includes(value)) {
                throw new Error("El día no es válido");
            }
            return true;
        }),
        check('tipo', 'El tipo debe ser un número').not().isEmpty().custom(value => {
            if(!tipos.includes(value)) {
                throw new Error("El tipo no es válido");
            }
            return true;
        }),
        check('tipoActuacion', 'El tipo de actuación no es válido').not().isEmpty().custom(value => {
            if(!tipoActuacion.includes(value)) {
                throw new Error("El tipo de actuación no es válido");
            }
            return true;
        }),
        check('fechaSalida', 'La fecha de salida es inválida').isISO8601().toDate().custom( value => {
            const fecha = new Date(value);
            if(fecha < new Date()) {
                throw new Error("La fecha de salida no puede ser menor que la fecha actual");
            }
            return true;
        }),
        check('lugarSalida', 'El lugar de salida debe contener entre 1 y 50 caracteres').isLength({min:1, max: 50}),
        check('banda', 'La banda es inválida').isMongoId(),
        
    ],
    validarCampos,
    crearActuacion);

// Operaciones sobre ensayos
router.post('/ensayo',
    [   
        check('titulo', 'El título debe contener entre 1 y 50 caracteres').isLength({min:1, max: 50}),
        check('descripcion', 'La descripción debe de contener como máximo 2000 caracteres').isLength({max: 2000}),
        check('fechaInicio', 'La fecha tiene que ser futura').isISO8601().toDate().custom( value => {
            const fecha = new Date(value);
            if(fecha < new Date()) {
                throw new Error("La fecha de inicio no puede ser menor que la fecha actual");
            }
            return true;
        }),
        check('fechaFin', 'La fecha tiene que ser futura').isISO8601().toDate().custom( value => {
            const fecha = new Date(value);
            if(fecha < new Date()) {
                throw new Error("La fecha de fin no puede ser menor que la fecha actual");
            }
            return true;
        }),
        check('lugar', 'El lugar debe contener entre 1 y 50 caracteres').isLength({min:1, max: 50}),
        check('tematica', 'La temática debe contener entre 1 y 200 caracteres').isLength({min:1, max: 200}),
        check('banda', 'La banda es inválida').isMongoId(),
        
    ],
    validarCampos,
    crearEnsayo);

// Operaciones comunes



module.exports = router;
