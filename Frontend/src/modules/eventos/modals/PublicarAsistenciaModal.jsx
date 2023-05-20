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
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { useAuthStore } from "../../../hooks";
import { useAsistenciasStore } from "../../../hooks/useAsistenciasStore";
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

export const PublicarAsistenciaModal = ({
  open,
  handleClose,
  evento,
  setOpen,
  tipo,
}) => {
  const {
    actualizarAsistencia,
    crearAsistencia,
    errores,
    setErrores,
    getAsistenciaByUsuarioEventoAndTipo,
  } = useAsistenciasStore();
  const [modo, setModo] = useState("crear");
  const { user } = useAuthStore();
  const [asistencia, setAsistencia] = useState();
  const [values, setValues] = useState({
    respuesta: "Asisto",
    tipo: evento.tipo,
    comentario: "",
    referencia: evento._id,
    usuario: user.uid,
  });

  const handleForm = async (e) => {
    e.preventDefault();
    let error = "";
    const lista = ["Asisto", "No asisto"];
    const lista2 = ["Procesion", "Actuacion", "Ensayo"];
    values.tipo =
      tipo === "Procesión"
        ? "Procesion"
        : tipo === "Actuación"
        ? "Actuacion"
        : "Ensayo";
    if (values.comentario > 200)
      error = error + " El nombre debe de contener menos de 200 caracteres";
    if (!lista.includes(values.respuesta))
      error = error + " <br>  La respuesta no es válida";
    if (!lista2.includes(values.tipo))
      error = error + " <br>  El tipo no es válido";

    if (error != "") {
      Swal.fire("Error al añadir asistencia al evento", error, "error");
    } else {
      await crearAsistencia(values);
      setOpen(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    let error = "";
    const lista = ["Asisto", "No asisto"];
    const lista2 = ["Procesion", "Actuacion", "Ensayo"];
    values.tipo =
      tipo === "Procesión"
        ? "Procesion"
        : tipo === "Actuación"
        ? "Actuacion"
        : "Ensayo";
    if (values.comentario > 200)
      error = error + " El nombre debe de contener menos de 200 caracteres";
    if (!lista.includes(values.respuesta))
      error = error + " <br>  La respuesta no es válida";
    if (!lista2.includes(values.tipo))
      error = error + " <br>  El tipo no es válido";

    if (error != "") {
      Swal.fire("Error al actualizar asistencia", error, "error");
    } else {
      await actualizarAsistencia(values, asistencia._id);
      setOpen(false);
    }
  };

  const handleChangeInput = (input) => (e) => {
    const { value } = e.target;
    setValues({ ...values, [input]: value });
  };

  useEffect(() => {
    if (errores !== "") {
      Swal.fire("Error al publicar asistencia", errores, "error");
      setErrores("");
    }
  }, [errores]);

  useEffect(() => {
    setValues({
      respuesta: "Asisto",
      tipo: evento.tipo,
      comentario: "",
      referencia: evento._id,
      usuario: user.uid,
    });
  }, [evento]);

  useEffect(() => {
    const getAsistencia = async () => {
      if (user.uid && evento._id && tipo) {
        const t =
          tipo === "Procesión"
            ? "Procesion"
            : tipo === "Actuación"
            ? "Actuacion"
            : "Ensayo";
        const asistencia = await getAsistenciaByUsuarioEventoAndTipo(
          user.uid,
          evento._id,
          t
        );

        if (asistencia) {
          setModo("actualizar");
          setAsistencia(asistencia);
          setValues(asistencia);
        }
      }
    };
    getAsistencia();
  }, [evento, tipo, user]);

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
            {modo === "crear" && (
              <Typography
                variant="h4"
                sx={{ textAlign: "center", color: "white" }}
              >
                Publicar asistencia al evento
              </Typography>
            )}
            {modo === "actualizar" && (
              <Typography
                variant="h4"
                sx={{ textAlign: "center", color: "white" }}
              >
                Actualizar asistencia al evento
              </Typography>
            )}
            <Grid container>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography sx={{ color: "white" }}>Asistencia*</Typography>
                <Select
                  style={{ color: "white", border: "1px solid #e2e2e1" }}
                  inputProps={{ style: { color: "white" } }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Age"
                  value={values.respuesta}
                  fullWidth
                  onChange={handleChangeInput("respuesta")}
                >
                  <MenuItem key={"Asisto"} value={"Asisto"}>
                    Asisto
                  </MenuItem>
                  <MenuItem key={"No asisto"} value={"No asisto"}>
                    No asisto
                  </MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography sx={{ color: "white" }}>
                  Comentario sobre asistencia
                </Typography>
                <TextField
                  sx={{ input: { color: "white" } }}
                  inputProps={{ style: { color: "white" } }}
                  type="text"
                  placeholder="comentario"
                  fullWidth
                  focused
                  style={{ border: "1px solid #e2e2e1", borderRadius: "5px" }}
                  onChange={handleChangeInput("comentario")}
                  multiline
                  rows={3}
                  value={values.comentario}
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
              {modo === "crear" ? (
                <Button
                  aria-label="enviar"
                  color="secondary"
                  sx={{ backgroundColor: "white", color: "black" }}
                  variant="contained"
                  onClick={handleForm}
                >
                  Publicar asistencia
                </Button>
              ) : (
                <Button
                  aria-label="enviar"
                  color="secondary"
                  sx={{ backgroundColor: "white", color: "black" }}
                  variant="contained"
                  onClick={handleUpdate}
                >
                  Actualizar asistencia
                </Button>
              )}
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
