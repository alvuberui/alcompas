const { Router } = require("express");
const router = Router();
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarArchivoSubir } = require("../middlewares/validar-archivo");
const {
  añadirFoto,
  mostrarImagenUsuario,
  añadirFotoBanda,
  mostrarImagenBanda,
} = require("../controllers/uploads");

// Validar JWT
router.use(validarJWT, validarCampos);

// Subir imagen como usuario
router.post(
  "/subir/foto/usuario/id/:usuarioId",
  validarArchivoSubir,
  añadirFoto
);

// Subir imagen como banda
router.post(
  "/subir/foto/banda/id/:bandaId",
  validarArchivoSubir,
  añadirFotoBanda
);

// Obtener foto de perfil de un usuario
router.get(
  "/get/foto/usuario/:userId",
  [check("userId", "El id debe de ser de mongo").isMongoId(), validarCampos],
  mostrarImagenUsuario
);

// Obtener foto de perfil de una banda
router.get(
  "/get/foto/banda/:bandaId",
  [check("bandaId", "El id debe de ser de mongo").isMongoId(), validarCampos],
  mostrarImagenBanda
);

module.exports = router;
