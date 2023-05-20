import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { useObrasStore } from "../../../hooks";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70vh",
  bgcolor: "#262254",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
};

export const NuevaObra = ({
  open,
  handleClose,
  setObras,
  setOpen,
  repertorio,
}) => {
  const [values, setValues] = useState({ titulo: "", compositor: "" });
  const { crearObra } = useObrasStore();
  const { bandaId } = useParams();

  const handleForm = async (e) => {
    e.preventDefault();
    let error = "";

    if (values.titulo.length > 50 || values.titulo.length < 1)
      error = error + " El nombre debe de contener emtre 1 y 50 caracteres";
    if (values.compositor.length > 50 || values.compositor.length < 1)
      error =
        error + " <br>  El compositor debe de contener emtre 1 y 50 caracteres";

    if (error != "") {
      Swal.fire("Error al añadir obra", error, "error");
    } else {
      const res = await crearObra(repertorio._id, values);
      if (res) {
        setObras((prev) => [...prev, res]);
        setOpen(false);
        Swal.fire(
          "Obra añadida",
          "La obra se ha añadido correctamente",
          "success"
        );
        setValues({ titulo: "", compositor: "" });
      }
    }
  };

  const handleChangeInput = (input) => (e) => {
    values[input] = e.target.value;
    if (input === "select") setNombre(e.target.value);
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
              Añadir Nueva obra
            </Typography>
            <Grid container>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography sx={{ color: "white" }}>
                  Nombre de la obra
                </Typography>
                <TextField
                  sx={{ input: { color: "white" } }}
                  type="text"
                  placeholder="Nombre"
                  fullWidth
                  focused
                  style={{ border: "1px solid #e2e2e1", borderRadius: "5px" }}
                  onChange={handleChangeInput("titulo")}
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography sx={{ color: "white" }}>Compositor</Typography>
                <TextField
                  sx={{ input: { color: "white" } }}
                  inputProps={{ style: { color: "white" } }}
                  type="text"
                  placeholder="Compositor"
                  fullWidth
                  focused
                  style={{ border: "1px solid #e2e2e1", borderRadius: "5px" }}
                  onChange={handleChangeInput("compositor")}
                />
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
                Añadir Obra
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
