const { Router }= require('express');
const router = Router();
const { check } = require('express-validator');



const { crearUsuario, revalidarToken, loginUsuario, getById, cambiarDatos, modificarContraseña,deleteById } = require('../controllers/auth');
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
        check('nombre', 'El nombre debe de contener mínimo un caracter y máximo 15').notEmpty().isLength({ min: 1, max: 15 }),
        check('primer_apellido', "El primer apellido debe de contener mínimo un caracter y máximo 15").not().isEmpty().isLength({ min: 1, max: 15 }),
        check('segundo_apellido', 'El segundo apellido debe de contener mínimo un caracter y máximo 15').not().isEmpty().isLength({ min: 1, max: 15 }),
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
        check('descripcion', 'La descripción debe de contener mínimo un caracter y máximo 200').not().isEmpty().isLength({ min: 1, max: 200 }),
        check('localidad', 'La localidad debe de contener mínimo un caracter y máximo 15').not().isEmpty().isLength({ min: 1, max: 15 }),
        check('provincia', 'La provincia debe de contener mínimo un caracter y máximo 15').not().isEmpty().isLength({ min: 1, max: 15 }),
        check('codigo_postal', 'El codigo postal no es válido').isPostalCode('ES'),
        check('direccion', 'La dirección debe de contener mínimo un caracter y máximo 30').not().isEmpty().isLength({ min: 1, max: 100 }),
        check('nif', 'El nif nos es válido').isIdentityCard('ES'),
        check('telefono', 'El telefono no es válido').isMobilePhone(),
        check('usuario', 'El usuario debe de contener mínimo un caracter y máximo 12').not().isEmpty().isLength({ min: 1, max: 30 }),
        check('contraseña', 'La contraseña debe de contener mínimo 5 caracteres y máximo 20').not().isEmpty().isLength({ min: 5, max: 20 }),
        validarCampos
    ],
    crearUsuario);

/*
* Este middelware es para cambiar datos de usuario
*/
router.put(
    '/update/:id',
    [
        check('nombre', 'El nombre debe de contener mínimo un caracter y máximo 15').notEmpty().isLength({ min: 1, max: 15 }),
        check('primer_apellido', "El primer apellido debe de contener mínimo un caracter y máximo 15").not().isEmpty().isLength({ min: 1, max: 15 }),
        check('segundo_apellido', 'El segundo apellido debe de contener mínimo un caracter y máximo 15').not().isEmpty().isLength({ min: 1, max: 15 }),
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
        check('descripcion', 'La descripción debe de contener mínimo un caracter y máximo 200').not().isEmpty().isLength({ min: 1, max: 200 }),
        check('localidad', 'La localidad debe de contener mínimo un caracter y máximo 15').not().isEmpty().isLength({ min: 1, max: 15 }),
        check('provincia', 'La provincia debe de contener mínimo un caracter y máximo 15').not().isEmpty().isLength({ min: 1, max: 15 }),
        check('codigo_postal', 'El codigo postal no es válido').isPostalCode('ES'),
        check('direccion', 'La dirección debe de contener mínimo un caracter y máximo 30').not().isEmpty().isLength({ min: 1, max: 100 }),
        check('nif', 'El nif nos es válido').isIdentityCard('ES'),
        check('telefono', 'El telefono no es válido').isMobilePhone(),
        check('usuario', 'El usuario debe de contener mínimo un caracter y máximo 12').not().isEmpty().isLength({ min: 1, max: 30 }),
        validarCampos
    ],
    cambiarDatos);

/*
* Este middelware es para cambiar datos de usuario
*/
router.put(
    '/update/contrasena/:id',
    [
        check('contraseñaNueva', 'La contraseña debe de contener mínimo 5 caracteres y máximo 20').not().isEmpty().isLength({ min: 5, max: 20 }),
        validarCampos
    ],
    modificarContraseña);

/*
* Este middelware es para la actualización del token
*/
router.get('/renew', validarJWT , revalidarToken);

/*
* Este middelware es para obtener un usuario a través de su id
*/
router.get('/:id', validarJWT , getById);

/*
* Este middelware es para obtener un usuario a través de su id
*/
router.delete('/:id', validarJWT , deleteById);




module.exports = router;