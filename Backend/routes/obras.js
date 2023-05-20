const { Router } = require("express");
const router = Router();
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearObra,
  obtenerByRepertorioId,
  eliminarObra,
} = require("../controllers/obras");

// Validar JWT
router.use(validarJWT, validarCampos);

// Craer obra
router.post(
  "/",
  check("titulo", "El título es obligatorio").isLength({ min: 1, max: 50 }),
  check(
    "compositor",
    "El compositor debe contener entre 1 y 50 caracteres"
  ).isLength({ min: 1, max: 50 }),
  check("repertorio", "El repertorio es obligatorio").isMongoId(),
  validarCampos,
  crearObra
);

// Obtener obras asignadas a un repertorio
router.get("/repertorio/:repertorioId", obtenerByRepertorioId);

// Eliminar obra
router.delete("/:id", eliminarObra);

module.exports = router;
