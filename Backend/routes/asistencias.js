const { Router }= require('express');
const router = Router();
const { check } = require('express-validator');
const { actualizarAsistencia, crearAsistencia, getAsistenciaByUsuarioEventoAndTipo, getTodasAsistenciasByEvento } = require('../controllers/asistencias');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

/*
* Aquí se configuran todas la rutas de /api/asistencias
*/
router.use( validarJWT );

   // Crear asistencia
router.post('/',
   [
       check('respuesta', 'La respuesta no es válida').notEmpty().custom( value => {
           const lista = ['Asisto', 'No asisto'];
           if(!lista.includes(value)) {
               throw new Error("La respuesta no es válida");
           }
           return true;
       }),
       check('tipo', 'El tipo de evento no es válido').notEmpty().custom( value => {
        const lista = ['Procesion', 'Actuacion', 'Ensayo']
        if(!lista.includes(value)) {
            throw new Error("El tipo no es válido");
        }
        return true;
        }),
       check('comentario', 'El comentario no puede contener más de 200 caracteres').isLength({max: 200}),
       check('referencia', 'La referencia no es válida').isMongoId(),
       check('usuario', 'El usuario es obligatorio').isMongoId(),
   ],
   validarCampos,
   crearAsistencia);

   // Actualizar asistencia
router.put('/:id',
   [
       check('respuesta', 'El tipo de estudio no es válido').notEmpty().custom( value => {
           const lista = ['Asisto', 'No asisto'];
           if(!lista.includes(value)) {
               throw new Error("La respuesta no es válida");
           }
           return true;
       }),
       check('comentario', 'El comentario no puede contener más de 200 caracteres').isLength({max: 200}),
       check('referencia', 'La referencia no es válida').isMongoId(),
       check('usuario', 'El usuario es obligatorio').isMongoId(),
   ],
   validarCampos,
   actualizarAsistencia);

   // Obtener la asistencia de un usuario a un evento segun el id del usuario, id del evento y el tipo del evento
router.get('/usuario/:usuarioId/evento/:eventoId/tipo/:tipoEvento', getAsistenciaByUsuarioEventoAndTipo);

   // Obtener todas las asistencia de todos los musicos de una banda para un evento
router.get('/evento/:eventoId/tipo/:tipoEvento', getTodasAsistenciasByEvento);


module.exports = router;    