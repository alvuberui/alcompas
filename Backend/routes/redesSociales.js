const { Router } = require("express");
const router = Router();
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearRedSocial,
  getRedesByBandaId,
  eliminarRedSocial,
} = require("../controllers/redesSociales");

// Validar JWT
router.use(validarJWT, validarCampos);

// Añadir una red social a una banda
router.post(
  "/",
  check(
    "nombre",
    "El título es obligatorio y como máximo debe tener 150 caracteres"
  ).isLength({ min: 1, max: 150 }),
  check("url", "El texto debe contener entre 1 y 2000 caracteres").isLength({
    min: 1,
    max: 2000,
  }),
  check("banda", "La banda es obligatoria").isMongoId(),
  validarCampos,
  crearRedSocial
);

// Obtener todas las redes sociales de una banda
router.get("/banda/id/:id", getRedesByBandaId);

// Eliminar una red social a traves de su id
router.delete("/:id", eliminarRedSocial);

module.exports = router;
