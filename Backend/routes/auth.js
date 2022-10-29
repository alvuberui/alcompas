const { Router }= require('express');
const router = Router();
const { check } = require('express-validator');



const { crearUsuario, revalidarToken, loginUsuario } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
// Aquí se configuran todas las subrutas de /api/auth

/*
* Este middelware es para el login (ruta por defecto)
*/
router.post(
    '/',
    [
        check('correo', 'El correo debe de ser válido').isEmail(),
        check('contraseña', "La contraseña debe tener al meno 6 caracteres").isLength({ min: 6 }),
        validarCampos
    ],
    loginUsuario);

/*
* Este middelware es para el registro de usuario
*/
router.post(
    '/register',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('primer_apellido', "El primer apellido es obligatorio").not().isEmpty(),
        check('segundo_apellido', 'El segundo apellido es obligatorio').not().isEmpty(),
        check('fecha_nacimiento', 'La fecha de nacimiento no es válida').isISO8601().toDate().custom(value=>{
            let fecha_entrada = new Date(value);
            var diferencia = Date.now() - fecha_entrada;
            var diferencia_fechas = new Date(diferencia); 
            let años = Math.abs(diferencia_fechas.getUTCFullYear() - 1970);

            if(años < 12){
                throw new Error("Debe de ser mayor de 12 años");
            }
            return true;
        }),
        check('correo', "El correo electrónico no es válido").isEmail(),
        check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
        check('localidad', 'La localidad es obligatoria').not().isEmpty(),
        check('provincia', 'La provincia es obligatoria').not().isEmpty(),
        check('codigo_postal', 'El codigo postal no es válido').isPostalCode('ES'),
        check('direccion', 'La dirección es obligatoria').not().isEmpty(),
        check('nif', 'El nif nos es válido').isIdentityCard('ES'),
        check('telefono', 'El telefono no es válido').isMobilePhone(),
        check('usuario', 'El nombre de usuario es obligatorio').not().isEmpty(),
        check('contraseña', 'La contraseña es obligatoria').not().isEmpty(),
        check('administrador', 'Administrador es obligatorio').isBoolean(), 
        validarCampos
    ],
    crearUsuario);

/*
* Este middelware es para la actualización del token
*/
router.get('/renew', validarJWT , revalidarToken);


module.exports = router;