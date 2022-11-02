const { Router }= require('express');
const router = Router();
const { check } = require('express-validator');
const { crearArchivero, finalizarArchivero, eliminarArchiveros } = require('../controllers/archiveros');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

/*
* Aquí se configuran todas la rutas de /api/archiveros
*/
router.use( validarJWT );

   // Crear un archivero:
router.post('/',
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
       check('fecha_final', "La fecha final no debe estar definida").isEmpty(),
       check('banda', 'La banda es obligatoria').not().isEmpty(),
       validarCampos
   ],
   crearArchivero);

   // Finalizar rol de archivero
router.put('/', finalizarArchivero);

   // Eliminar archivero
router.delete('/:id', eliminarArchiveros);

module.exports = router;    