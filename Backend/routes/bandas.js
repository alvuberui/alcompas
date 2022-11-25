const { Router }= require('express');
const router = Router();


const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { crearBanda, actualizar_banda, eliminar_banda, getBandaById
        ,getBandasByUserId} = require('../controllers/bandas');

const { validarCampos } = require('../middlewares/validar-campos');


    // Validar JWT
router.use( validarJWT );


    // Crear banda
router.post(
    '/', 
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('tipo', 'El tipo de banda es obligatorio').not().isEmpty().custom(value => {
            condicion_a = value == 'Banda de Música';
            condicion_b = value == 'Banda de Cornetas y Tambores';
            condicion_c = value == 'Agrupación Musical';

            if(condicion_a == false && condicion_b == false && condicion_c == false) {
                throw new Error("Tipo de banda incorrecto");
            }
            return true;
        }),
        check('localidad', 'La localidad es obligatoria').not().isEmpty(),
        check('provincia', "La provincia es obligatoria").not().isEmpty(),
        check('codigo_postal', "El código postal es invalido").isPostalCode('ES'),
        check('direccion', "La dirección es obligatoria").not().isEmpty(),
        check('año_fundacion', "El año de fundación no es válido").not().isEmpty().custom(value=>{
            const fecha_actual = new Date()
             
            const año_actual = fecha_actual.getFullYear();
    
            if(value > año_actual){
                throw new Error("El año no puede ser mayor que el actual");
            }
            return true;
        }),
        check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
        check('telefono', 'El número de teléfono es inválido').isMobilePhone().isLength({min:9, max:9}),
        check('correo', 'El email es inválido').isEmail(),
        check('cif', 'El CIF es inválido').not().isEmpty().custom(value => {
            const primer_valor = value[0];
            const cadena = value.replace(primer_valor, '');
            const longitud = value.length;
            let solo_letras = /^\d+$/.test(cadena);
            if(longitud != 9 || !solo_letras) {
                throw new Error("El cif es inválido");
            }
            return true;
        }),
        validarCampos
    ],
    crearBanda);

    // Actualizar banda
router.put(
    '/:id',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('tipo_banda', 'El tipo de banda es obligatorio').not().isEmpty().custom(value => {
            condicion_a = value == 'Banda de Música';
            condicion_b = value == 'Banda de Cornetas y Tambores';
            condicion_c = value == 'Agrupación Musical';

            if(condicion_a == false && condicion_b == false && condicion_c == false) {
                throw new Error("Tipo de banda incorrecto");
            }
            return true;
        }),
        check('localidad', 'La localidad es obligatoria').not().isEmpty(),
        check('provincia', "La provincia es obligatoria").not().isEmpty(),
        check('codigo_postal', "El código postal es invalido").isPostalCode('ES'),
        check('direccion', "La dirección es obligatoria").not().isEmpty(),
        check('año_fundacion', "El año de fundación no es válido").not().isEmpty().custom(value=>{
            const fecha_actual = new Date()
             
            const año_actual = fecha_actual.getFullYear();
    
            if(value > año_actual){
                throw new Error("El año no puede ser mayor que el actual");
            }
            return true;
        }),
        check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
        check('telefono', 'El número de teléfono es inválido').isMobilePhone().isLength({min:9, max:9}),
        check('correo', 'El email es inválido').isEmail(),
        check('cif', 'El CIF es inválido').not().isEmpty().custom(value => {
            const primer_valor = value[0];
            const cadena = value.replace(primer_valor, '');
            const longitud = value.length;
            let solo_letras = /^\d+$/.test(cadena);
            if(longitud != 9 || !solo_letras) {
                throw new Error("El cif es inválido");
            }
            return true;
        }),
        validarCampos
    ],
    actualizar_banda,
);

    // Eliminar banda
router.delete('/:id', eliminar_banda);

    // Obtener banda a través de su id
router.get('/:id', getBandaById);

    // Obtener todas las banda de un usuario
router.get('/misBandas/:userId', getBandasByUserId);



module.exports = router;