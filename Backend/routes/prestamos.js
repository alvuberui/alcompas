const { Router } = require("express");
const router = Router();
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearPrestamo,
  getPrestamoActivoObjeto,
  cancelarPrestamo,
  obtenerPrestamosUsuario,
  obtenerTodasByBanda,
} = require("../controllers/prestamos");

// Validar JWT
router.use(validarJWT, validarCampos);

// Crear prestamo
router.post(
  "/",
  [
    check("comentario", "El comentario es obligatorio").isLength({ max: 500 }),
    check("tipo", "El tipo es obligatorio")
      .not()
      .isEmpty()
      .isIn(["Instrumento", "Vestimenta"]),
    check("referencia", "La referencia es obligatoria").isMongoId(),
    check("usuario", "El usuario es obligatorio").isMongoId(),
    validarCampos,
  ],
  crearPrestamo
);

// Obtener prestamo activo a partir de su referencia
router.get("/activo/:tipo/:referenciaId", getPrestamoActivoObjeto);

// Cancelar prestamo activo
router.put("/cancelar/:id", cancelarPrestamo);

//Obtener todos los prestamos de un usuario
router.get("/usuario/:id", obtenerPrestamosUsuario);

// Obtener todos los prestamos de una banda
router.get("/banda/:id", obtenerTodasByBanda);

module.exports = router;
