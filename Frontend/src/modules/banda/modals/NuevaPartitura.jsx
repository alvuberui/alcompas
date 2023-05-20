import { Box, Button, Grid, MenuItem, Select, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { usePartiturasStore } from "../../../hooks";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50vh",
  bgcolor: "#262254",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
};

const instrumentos = [
  "Corneta",
  "Tambor",
  "Bordonera",
  "Caja",
  "Bombo",
  "Platos",
  "Percusionista",
  "Tuba",
  "Trombón",
  "Bombardino",
  "Trompa",
  "Fliscorno",
  "Trompeta",
  "Saxofón Alto",
  "Saxofón Tenor",
  "Saxofón Barítono",
  "Clarinete",
  "Flauta",
  "Flautín",
  "Oboe",
  "Fagot",
  "Lira",
  "Campana",
  "Cascabeles",
  "Batería",
  "Xilófono",
  "Timbales",
  "Campanilla",
  "Clarinete Bajo",
  "Requinto",
  "Director",
];
const voces = ["Principal", "Primero", "Segundo", "Tercero"];

export const NuevaPartitura = ({
  open,
  handleClose,
  setPartituras,
  setOpen,
  obra,
}) => {
  const [values, setValues] = useState({
    instrumento: "Clarinete",
    voz: "Primero",
  });
  const { crearPartitura } = usePartiturasStore();
  const [partitura, setPartitura] = useState("");
  const [nombre, setNombre] = useState("");

  const handleForm = async (e) => {
    e.preventDefault();
    let error = "";

    if (!instrumentos.includes(values.instrumento))
      error = error + " El instrumento no es válido";
    if (!voces.includes(values.voz))
      error = error + " <br>  La voz no es válida";
    if (nombre === "" || partitura === "")
      error = error + " <br>  Es obligatorio subir un archivo";

    if (error != "") {
      Swal.fire("Error al añadir partitura", error, "error");
    } else {
      const res = await crearPartitura(obra, values, partitura);

      if (res) {
        setPartituras((prev) => [...prev, res]);
        setOpen(false);
        Swal.fire(
          "Partitura añadida",
          "La partitura se ha añadido correctamente",
          "success"
        );
        setValues({ instrumento: "Clarinete", voz: "Primero" });
        setPartitura("");
        setNombre("");
      }
    }
  };
  const handleChangeInput = (input) => (e) => {
    const { value } = e.target;
    setValues({ ...values, [input]: value });
  };

  const handleChangePartitura = (input) => (e) => {
    setPartitura(e.target.files[0]);
    setNombre(e.target.value);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        id="cambiar-contraseña"
      >
        <Box sx={style}>
          <form>
            <Typography
              variant="h4"
              sx={{ textAlign: "center", color: "white" }}
            >
              Añadir Nueva Partitura
            </Typography>
            <Grid container>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography sx={{ color: "white" }}>Instrumento</Typography>
                <Select
                  style={{ color: "white", border: "1px solid #e2e2e1" }}
                  inputProps={{ style: { color: "white" } }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={values.instrumento}
                  label="Age"
                  sx={{ width: "45vh", color: "white" }}
                  onChange={handleChangeInput("instrumento")}
                >
                  {instrumentos.map((tipo, index) => (
                    <MenuItem key={index} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography sx={{ color: "white" }}>Voz</Typography>
                <Select
                  style={{ color: "white", border: "1px solid #e2e2e1" }}
                  inputProps={{ style: { color: "white" } }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={values.voz}
                  label="Age"
                  sx={{ width: "45vh", color: "white" }}
                  onChange={handleChangeInput("voz")}
                >
                  {voces.map((tipo, index) => (
                    <MenuItem key={index} value={tipo}>
                      {tipo}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid container>
                <Grid item xs={12} sx={{ mt: "10px" }}>
                  <Typography sx={{ color: "white" }}>
                    Seleccione la foto:
                  </Typography>
                </Grid>
                <Grid item xs={12} sx={{ mt: "10px" }}>
                  <input
                    type="file"
                    style={{ color: "white" }}
                    onChange={handleChangePartitura("img")}
                    value={nombre}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Box
              sx={{
                mt: 2,
                display: "flex",
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <Button
                aria-label="enviar"
                color="secondary"
                sx={{ backgroundColor: "white", color: "black" }}
                variant="contained"
                onClick={handleForm}
              >
                Añadir Partitura
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
