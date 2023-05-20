const { Router } = require("express");
const router = Router();
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearRepertorio,
  getRepertoriosByBandaId,
  eliminarRepertorio,
} = require("../controllers/repertorios");

// Validar JWT
router.use(validarJWT, validarCampos);

// Craer repertorio
router.post(
  "/",
  check("titulo", "El título es obligatorio").isLength({ min: 1, max: 50 }),
  check(
    "descripcion",
    "La descripción debe contener entre 1 y 500 caracteres"
  ).isLength({ max: 500 }),
  check("banda", "La banda es obligatoria").isMongoId(),
  validarCampos,
  crearRepertorio
);

// Obtener repertorios asignados a una banda
router.get("/banda/:bandaId", getRepertoriosByBandaId);

// Eliminar repertorio
router.delete("/:id", eliminarRepertorio);

module.exports = router;
