const { Router } = require("express");
const router = Router();
const { check } = require("express-validator");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearPartitura,
  verMisParituras,
  getPartituraById,
  eliminarPartitura,
} = require("../controllers/partituras");
const { validarArchivoSubir } = require("../middlewares/validar-archivo");

// Validar JWT
router.use(validarJWT, validarCampos);

// Craer repertorio
router.post("/", validarArchivoSubir, crearPartitura);

// Obtener partituras
router.get("/obra/:obraId", verMisParituras);

router.get(
  "/:partituraId",
  [
    check("partituraId", "El id debe de ser de mongo").isMongoId(),
    validarCampos,
  ],
  getPartituraById
);

// Eliminar partitura
router.delete("/:partituraId", eliminarPartitura);

module.exports = router;
