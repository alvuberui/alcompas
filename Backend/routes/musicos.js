const { Router } = require("express");
const router = Router();

const {
  finalizarMusico,
  getMusicosByBandaId,
  getMusicoById,
  getMusicosByUserId,
  getMusicosByIntrumentoAndLocalidad,
  esMusicoByBandaId,
} = require("../controllers/musicos");
const { validarJWT } = require("../middlewares/validar-jwt");

/*
 * Aquí se configuran todas la rutas de /api/directivos
 */
router.use(validarJWT);

// Finalizar rol de músico
router.put("/finalizar/:userId/:bandaId", finalizarMusico);

// Obtener musicos a traves de la banda
router.get("/byAllByBandaId/:bandaId", getMusicosByBandaId);

// Obtener los musicos a traves de la id del musico
router.get("/:id", getMusicoById);

// Obtener los roles de músico de un usuario
router.get("/user/id/:userId", getMusicosByUserId);

// Obtener musicos by instrumento y localidad
router.get(
  "/instrumento/:instrumento/localidad/:localidad",
  getMusicosByIntrumentoAndLocalidad
);

// Es músico de una banda
router.get("/banda/:bandaId", esMusicoByBandaId);

module.exports = router;
