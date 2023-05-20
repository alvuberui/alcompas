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
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { useTransaccionesStore } from "../../../hooks";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "45vh",
  maxHeight: "95vh",
  bgcolor: "#262254",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
};

const nombres = ["Beneficio", "Gasto"];

export const NuevoTransaccion = ({
  open,
  handleClose,
  setTransacciones,
  setOpen,
  editar,
  transaccion,
  setTotal,
  setOpenEditar,
  ultimoAño,
}) => {
  const [values, setValues] = useState({
    motivo: "",
    descripcion: "",
    tipo: "Beneficio",
    cantidad: "1.00",
    fecha: "2023-03-15",
  });

  useEffect(() => {
    if (editar) {
      setValues({
        motivo: transaccion.motivo,
        descripcion: transaccion.descripcion,
        tipo: transaccion.tipo,
        cantidad: transaccion.cantidad,
        fecha: transaccion.fecha,
      });
    } else {
      setValues({
        motivo: "",
        descripcion: "",
        tipo: "Beneficio",
        cantidad: "1.00",
        fecha: "",
      });
    }
  }, [editar, transaccion]);

  // Hooks
  const {
    crearTransaccion,
    errores,
    getByBanda,
    actualizarTransaccion,
    getTransaccionesUltimoAño,
  } = useTransaccionesStore();
  const { bandaId } = useParams();

  const updateFecha = (t) => {
    const transacciones2 = [];
    let cantidad = 0;
    for (let i = 0; i < t.length; i++) {
      const fecha = new Date(t[i].fecha);
      const año = fecha.getFullYear();
      const mes =
        (fecha.getMonth() + 1).toString().length == 1
          ? "0" + (fecha.getMonth() + 1)
          : fecha.getMonth() + 1;
      const dia =
        fecha.getDate().toString().length == 1
          ? "0" + fecha.getDate()
          : fecha.getDate();
      const fecha2 = año + "-" + mes + "-" + dia;
      t[i].fecha = fecha2;
      transacciones2.push(t[i]);
      if (t[i].tipo === "Beneficio") {
        cantidad = cantidad + t[i].cantidad;
      } else {
        cantidad = cantidad - t[i].cantidad;
      }
    }
    setTotal(cantidad);
    return transacciones2.reverse();
  };

  const handleForm = async (e) => {
    e.preventDefault();
    let error = "";
    const lista = ["Beneficio", "Gasto"];
    if (values.motivo.length > 50 || values.motivo.length < 1)
      error = error + " El motivo debe de contener entre 1 y 50 caracteres ";
    if (values.descripcion.length > 500)
      error =
        error + " <br>  La descripción no puede contener más de 500 caracteres";
    if (!lista.includes(values.tipo))
      error = error + " <br>  El tipo no es válido";
    if (values.cantidad < 0)
      error = error + " <br>  La cantidad no puede ser negativa";
    if (values.fecha === "")
      error = error + " <br>  La fecha no puede estar vacía";
    if (error != "") {
      Swal.fire("Error al publicar transacción", error, "error");
    } else {
      values.banda = bandaId;
      if (editar) {
        const c = await actualizarTransaccion(values, transaccion._id);
        if (c !== undefined) {
          let t;
          if (ultimoAño) {
            t = await getTransaccionesUltimoAño(bandaId);
          } else {
            t = await getByBanda(bandaId);
          }
          const transacciones2 = updateFecha(t);
          setTransacciones(transacciones2);
          setOpenEditar(false);
          setValues({
            motivo: "",
            descripcion: "",
            tipo: "Beneficio",
            cantidad: "1.00",
            fecha: "",
          });
          setOpen(false);
        } else {
          setTimeout(() => {
            Swal.fire("Error al publicar transacción", errores, "error");
          }, 200);
        }
      } else {
        const c = await crearTransaccion(values);
        if (c !== undefined) {
          let t;
          if (ultimoAño) {
            t = await getTransaccionesUltimoAño(bandaId);
          } else {
            t = await getByBanda(bandaId);
          }
          const transacciones2 = updateFecha(t);
          setTransacciones(transacciones2);

          setValues({
            motivo: "",
            descripcion: "",
            tipo: "Beneficio",
            cantidad: "1.00",
            fecha: "",
          });
          setOpen(false);
        } else {
          setTimeout(() => {
            Swal.fire("Error al publicar transacción", errores, "error");
          }, 200);
        }
      }
    }
  };

  const handleChangeInput = (input) => (e) => {
    const { value } = e.target;
    setValues({ ...values, [input]: value });
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
              Añadir Transacción
            </Typography>
            <Grid container>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography sx={{ color: "white" }}>Motivo</Typography>
                <TextField
                  sx={{ input: { color: "white" } }}
                  inputProps={{ style: { color: "white" } }}
                  type="text"
                  placeholder="Motivo"
                  fullWidth
                  focused
                  style={{ border: "1px solid #e2e2e1", borderRadius: "5px" }}
                  onChange={handleChangeInput("motivo")}
                  multiline
                  value={values.motivo}
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography sx={{ color: "white" }}>Descripción</Typography>
                <TextField
                  sx={{ input: { color: "white" } }}
                  inputProps={{ style: { color: "white" } }}
                  type="text"
                  placeholder="Descripción"
                  fullWidth
                  focused
                  style={{ border: "1px solid #e2e2e1", borderRadius: "5px" }}
                  onChange={handleChangeInput("descripcion")}
                  multiline
                  rows={3}
                  value={values.descripcion}
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography sx={{ color: "white" }}>Tipo</Typography>
                <Select
                  style={{ color: "white", border: "1px solid #e2e2e1" }}
                  inputProps={{ style: { color: "white" } }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={values.tipo}
                  label="Tipo"
                  fullWidth
                  multiline
                  onChange={handleChangeInput("tipo")}
                >
                  {nombres.map((nombre, index) => (
                    <MenuItem key={index} value={nombre}>
                      {nombre}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography sx={{ color: "white" }}>Cantidad</Typography>
                <TextField
                  sx={{ input: { color: "white" } }}
                  inputProps={{ style: { color: "white" } }}
                  type="number"
                  placeholder="Cantidad"
                  fullWidth
                  focused
                  style={{ border: "1px solid #e2e2e1", borderRadius: "5px" }}
                  onChange={handleChangeInput("cantidad")}
                  value={values.cantidad}
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <TextField
                  label="Fecha"
                  type="date"
                  fullWidth
                  color="secondary"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ style: { color: "white" } }}
                  onChange={handleChangeInput("fecha")}
                  focused
                  value={values.fecha}
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
                onClick={handleForm}
                aria-label="enviar"
                color="secondary"
                sx={{ backgroundColor: "white", color: "black" }}
                variant="contained"
              >
                Publicar Transacción
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
