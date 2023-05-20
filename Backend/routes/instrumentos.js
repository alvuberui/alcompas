const { Router } = require("express");
const router = Router();
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarInstrumentos } = require("../middlewares/validar-instrumento");
const {
  crearInstrumentoUsuario,
  getInstrumentosByUserId,
  eliminarInstrumento,
  actualizarInstrumentoUsuario,
  getinstrumentosById,
  crearInstrumentoBanda,
  getTodosInstrumentosByBanda,
  editarInstrumentoBanda,
  eliminarInstrumentoBanda,
  obtenerTodosConPrestamosByBanda,
  obtenerTodosInstrumentosSinPrestarByBanda,
} = require("../controllers/instrumentos");

// Validar JWT
router.use(validarJWT, validarCampos);

// Obtener instrumentos de un usuario
router.get("/instrumentosByUserId/:userId", getInstrumentosByUserId);

// Obtener instrumento
router.get("/instrumentosById/:instrumentoId", getinstrumentosById);

// Crear instrumento usuario
router.post(
  "/usuario",
  [
    check("instrumento", "El instrumento no es válido").custom((value) => {
      if (value) {
        const condicion = validarInstrumentos(value);
        if (!condicion) {
          throw new Error("El instrumento no es válido");
        }
      }
      return true;
    }),
    check("modelo", "El modelo no puede tener más de 50 caracteres").isLength({
      max: 50,
    }),
    check(
      "numeroSerie",
      "El número de serie no puede tener más de 50 caracteres"
    ).isLength({ max: 50 }),
    check("marca", "La marca no puede tener más de 50 caracteres").isLength({
      max: 50,
    }),
    check("usuario", "El usuario es obligatorio").isMongoId(),
  ],
  validarCampos,
  crearInstrumentoUsuario
);

// Editar instrumento usuario
router.put(
  "/usuario/:instrumentoId",
  [
    check("instrumento", "El instrumento no es válido").custom((value) => {
      if (value) {
        const condicion = validarInstrumentos(value);
        if (!condicion) {
          throw new Error("El instrumento no es válido");
        }
      }
      return true;
    }),
    check("modelo", "El modelo no puede tener más de 50 caracteres").isLength({
      max: 50,
    }),
    check(
      "numeroSerie",
      "El número de serie no puede tener más de 50 caracteres"
    ).isLength({ max: 50 }),
    check("marca", "La marca no puede tener más de 50 caracteres").isLength({
      max: 50,
    }),
    check("usuario", "El usuario es obligatorio").isMongoId(),
  ],
  validarCampos,
  actualizarInstrumentoUsuario
);

// Eliminar instrumento usuario
router.delete("/:instrumentoId", eliminarInstrumento);

// Crear instrumento banda
router.post(
  "/banda",
  [
    check("instrumento", "El instrumento no es válido").custom((value) => {
      if (value) {
        const condicion = validarInstrumentos(value);
        if (!condicion) {
          throw new Error("El instrumento no es válido");
        }
      }
      return true;
    }),
    check("modelo", "El modelo no puede tener más de 50 caracteres").isLength({
      max: 50,
    }),
    check(
      "numeroSerie",
      "El número de serie no puede tener más de 50 caracteres"
    ).isLength({ max: 50 }),
    check("marca", "La marca no puede tener más de 50 caracteres").isLength({
      max: 50,
    }),
    check("banda", "El usuario es obligatorio").isMongoId(),
  ],
  validarCampos,
  crearInstrumentoBanda
);

// Obtener todos los instrumentos de una banda
router.get("/banda/:bandaId", getTodosInstrumentosByBanda);

// Editar instrumento banda
router.put(
  "/banda/:instrumentoId",
  [
    check("instrumento", "El instrumento no es válido").custom((value) => {
      if (value) {
        const condicion = validarInstrumentos(value);
        if (!condicion) {
          throw new Error("El instrumento no es válido");
        }
      }
      return true;
    }),
    check("modelo", "El modelo no puede tener más de 50 caracteres").isLength({
      max: 50,
    }),
    check(
      "numeroSerie",
      "El número de serie no puede tener más de 50 caracteres"
    ).isLength({ max: 50 }),
    check("marca", "La marca no puede tener más de 50 caracteres").isLength({
      max: 50,
    }),
    check("banda", "La banda es obligatoria").isMongoId(),
  ],
  validarCampos,
  editarInstrumentoBanda
);

// Eliminar instrumento banda
router.delete("/banda/:instrumentoId", eliminarInstrumentoBanda);

// Obtener todos los instrumentos pretados de una banda
router.get("/banda/prestados/:bandaId", obtenerTodosConPrestamosByBanda);

// Obtener todos los instrumentos sin prestar de una banda
router.get(
  "/banda/sinprestar/:bandaId",
  obtenerTodosInstrumentosSinPrestarByBanda
);

module.exports = router;
