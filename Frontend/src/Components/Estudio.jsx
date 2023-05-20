import { Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuthStore } from "../hooks";
import { useEstudiosStore } from "../hooks/useEstudiosStore";
import { AñadirEstudioModal } from "../modules/user/";

export const Estudio = ({
  _id,
  tipoEstudio,
  centroEstudios,
  poblacion,
  provincia,
  fechaInicio,
  fechaFin,
  setEstudios,
  usuario,
  eliminar,
  iguales,
}) => {
  // Estados
  const [usuarioPet, setUsuario] = useState([]);
  const [open, setOpen] = useState(false);
  const [fechaI, setFechaInicio] = useState(fechaInicio);
  const [fechaF, setFechaFin] = useState(fechaFin);
  // Funciones
  const { getUserByiD } = useAuthStore();
  const { eliminarEstudio } = useEstudiosStore();

  const handleOpenEditar = (event, newValue, editar) => {
    event.preventDefault();
    setOpen(true);
  };
  const handleCloseEditar = (event, newValue) => {
    event.preventDefault();
    setOpen(false);
  };

  const handleElminar = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "¿Está seguro de que desea eliminar su estudio?",
      text: "Esta acción será irreversible y no podrá recuperarlo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (resultado) => {
      if (resultado.value) {
        // Hicieron click en "Sí"
        const c = await eliminarEstudio(_id);
        eliminar(_id);
      }
    });
  };

  // Efectos
  useEffect(() => {
    const getUsuario = async () => {
      const usuarioreq = await getUserByiD(usuario);
      setUsuario(usuarioreq);
    };
    getUsuario();
  }, [open]);

  // Efectos
  useEffect(() => {
    const convertirFecha = async () => {
      setFechaInicio(new Date(fechaInicio).toLocaleDateString());
      setFechaFin(new Date(fechaFin).toLocaleDateString());
    };
    convertirFecha();
  }, [fechaInicio, fechaFin]);

  return (
    <Grid
      container
      sx={{
        mt: "15px",
        maxWidth: "95%",
        padding: 2,
        backgroundColor: "white",
        borderRadius: "5px",
        borderColor: "white",
        boxShadow:
          "rgba(0, 0, 0, 0.14) 0px 1px 1px 1px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px,  rgba(0, 0, 0, 0.2) 0px 1px 3px 1px",
      }}
    >
      <AñadirEstudioModal
        estudioId={_id}
        editar={true}
        open={open}
        handleClose={handleCloseEditar}
        setOpen={setOpen}
        setEstudios={setEstudios}
      ></AñadirEstudioModal>
      <Grid
        container
        display="flex"
        justifyContent="center"
        alignItems="baseline"
      >
        <>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", textAlign: "center", color: "black" }}
          >
            {tipoEstudio}
          </Typography>
        </>
      </Grid>
      <Grid container>
        <Grid item xs={12} sx={{ padding: 2 }}>
          <div>
            <Typography style={{ display: "inline-block" }}>
              <b>Centro de estudios:</b> {centroEstudios || "No especificado"}
            </Typography>
            <br></br>
            <Typography style={{ display: "inline-block" }}>
              <b>Población:</b> {poblacion || "No especificado"}
            </Typography>
            <br></br>
            <Typography style={{ display: "inline-block" }}>
              <b>Provincia:</b> {provincia || "No especificado"}
            </Typography>
            <br></br>
            <Typography style={{ display: "inline-block" }}>
              <b>Fecha de inicio:</b> {fechaI || "No especificado"}
            </Typography>
            <br></br>
            <Typography style={{ display: "inline-block" }}>
              <b>Fecha de finalización:</b> {fechaF || "No especificado"}
            </Typography>
          </div>
        </Grid>
        {iguales && (
          <Grid
            item
            xs={12}
            display="flex"
            justifyContent="center"
            alignItems="baseline"
          >
            <div>
              <Button
                aria-label="editar"
                color="primary"
                onClick={handleOpenEditar}
                sx={{ mr: "5px" }}
                variant="contained"
              >
                <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>
                  Editar
                </Typography>
              </Button>
              <Button
                aria-label="eliminar"
                color="primary"
                onClick={handleElminar}
                sx={{ ml: "5px" }}
                variant="contained"
              >
                <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>
                  Eliminar
                </Typography>
              </Button>
            </div>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
