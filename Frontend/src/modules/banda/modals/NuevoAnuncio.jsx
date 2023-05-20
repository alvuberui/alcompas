import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import * as React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthStore } from "../../../hooks/useAuthStore";

import { useAnunciosStore } from "../../../hooks";
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

const nombres = ["Pública", "Privada", "Restringida"];

export const NuevoAnuncio = ({ open, handleClose, setAnuncios, setOpen }) => {
  const [values, setValues] = useState({
    titulo: "",
    descripcion: "",
    privacidad: "Pública",
  });

  const { crearAnuncio, errores } = useAnunciosStore();

  const { bandaId } = useParams();

  const { user } = useAuthStore();

  const handleForm = async (e) => {
    e.preventDefault();
    let error = "";
    const lista = ["Pública", "Privada", "Restringida"];
    if (values.titulo.length > 75 || values.titulo.length < 1)
      error = error + " El título debe de contener entre 1 y 75 caracteres ";
    if (values.descripcion.length > 2000 || values.descripcion.length < 1)
      error =
        error + " <br>  El texto debe de contener entre 1 y 2000 caracteres";
    if (!lista.includes(values.privacidad))
      error =
        error +
        " <br>  La privacidad debe de ser Pública, Privada o Restringida";
    if (error != "") {
      Swal.fire("Error al publicar comentario", error, "error");
    } else {
      values.banda = bandaId;
      const c = await crearAnuncio(values);
      if (c.banda === bandaId) {
        setAnuncios((co) => [c, ...co]);
        setValues({ titulo: "", texto: "" });
        setOpen(false);
      } else {
        Swal.fire("Error al publicar anuncio", errores[0], "error");
      }
    }
  };

  const handleChangeInput = (input) => (e) => {
    values[input] = e.target.value;
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
              Añadir Anuncio
            </Typography>
            <Grid container>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography sx={{ color: "white" }}>Título</Typography>
                <TextField
                  sx={{ input: { color: "white" } }}
                  type="text"
                  placeholder="Título del comentario"
                  fullWidth
                  focused
                  style={{ border: "1px solid #e2e2e1", borderRadius: "5px" }}
                  onChange={handleChangeInput("titulo")}
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography sx={{ color: "white" }}>Descripción</Typography>
                <TextField
                  sx={{ input: { color: "white" } }}
                  inputProps={{ style: { color: "white" } }}
                  type="text"
                  placeholder="Texto de la descripción"
                  fullWidth
                  focused
                  style={{ border: "1px solid #e2e2e1", borderRadius: "5px" }}
                  onChange={handleChangeInput("descripcion")}
                  multiline
                  rows={10}
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography sx={{ color: "white" }}>Privacidad</Typography>
                <Select
                  style={{ color: "white", border: "1px solid #e2e2e1" }}
                  inputProps={{ style: { color: "white" } }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  defaultValue={values.privacidad}
                  label="Privacidad"
                  fullWidth
                  onChange={handleChangeInput("privacidad")}
                >
                  {nombres.map((nombre, index) => (
                    <MenuItem key={index} value={nombre}>
                      {nombre}
                    </MenuItem>
                  ))}
                </Select>
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
                Publicar anuncio
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
