const { Router }= require('express');
const router = Router();


const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
// const { crearBanda, actualizar_banda, eliminar_banda} = require('../controllers/bandas');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarCargo } = require('../middlewares/validar-cargo');
const { validarInstrumentos } = require('../middlewares/validar-instrumento');
const { validarVoz } = require('../middlewares/validar-voz');

    // Validar JWT
    router.use( validarJWT );


    // Crear banda
router.post('/',
    [
        check('fecha', 'La fecha no es válida').isISO8601().toDate().custom( value => {
            let fecha_entrada = new Date(value)
            let fecha_actual = new Date()
            
            if( fecha_actual.getDate() != fecha_entrada.getDate() 
                || fecha_actual.getMonth() != fecha_entrada.getMonth() 
                || fecha_actual.getFullYear() != fecha_entrada.getFullYear() ) {
                throw new Error("La fecha de inicio no es la actual");
            }
            return true;
        }),
        check('rol', 'El rol no es válido').notEmpty().custom( value => {
            const condicion1 = rol == 'Presidente';
            const condicion2 = rol == 'Archivero';
            const condicion3 = rol == 'Músico'

            if(!condicion1 && !condicion2 && !condicion3) {
                throw new Error("El rol no es válido");
            }
        }),
        check('cargo', 'El cargo no es válido').custom( value => {
            if(value) {
                const condicion = validarCargo(value);

                if(!condicion) {
                    throw new Error("El cargo no es válido");
                }
            }
            return true;
        }),
        check('mensaje', 'El mensaje es obligatorio').notEmpty(),
        check('instrumento', 'El instrumento no es válido').custom(value => {
            if (value) {
                const condicion = validarInstrumentos(value);
                if(!condicion) {
                    throw new Error("El instrumento no es válido");
                }
            }
            return true;
        }),
        check('voz', 'La voz no es válida').custom(value => {
            if(value) {
                const condicion = validarVoz(value);
                if(!condicion) {
                    throw new Error("La voz no es válida");
                }
            }
        }),
        check('estado', 'El estado de la petición no es valido').custom( value => {
            const estados = ['Pendiente', 'Aceptada', 'Denegada'];
            if(!estados.includes(value)) {
                throw new Error("El estado de la petición no es válido");
            }
        })
    ],
    validarCampos,
    crearPeticion);