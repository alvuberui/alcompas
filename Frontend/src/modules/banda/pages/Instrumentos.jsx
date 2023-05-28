import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Instrumento } from "../../../Components";
import {
  useAuthStore,
  useDirectivosStore,
  useInstrumentosStore,
} from "../../../hooks";
import { AñadirInstrumentoModal } from "../../user/modals/AñadirInstrumentoModal";

export const Instrumentos = () => {
  // LOS BUENOS
  const [instrumentos, setInstrumentos] = useState([]);
  const [open, setOpen] = React.useState(false);
  const { bandaId } = useParams();
  const [permiso, setPermiso] = useState("");
  const { user } = useAuthStore();
  const { getDirectivoByUserId } = useDirectivosStore();
  const {
    getTodosInstrumentosByBanda,
    obtenerTodosConPrestamosByBanda,
    obtenerTodosInstrumentosSinPrestarByBanda,
  } = useInstrumentosStore();

  const handleClose = (event, newValue) => {
    event.preventDefault();
    setOpen(false);
  };

  const handleTodos = async (event) => {
    event.preventDefault();
    const todos = await getTodosInstrumentosByBanda(bandaId);
    setInstrumentos(todos);
  };

  const handlePrestados = async (event) => {
    event.preventDefault();
    const prestados = await obtenerTodosConPrestamosByBanda(bandaId);
    setInstrumentos(prestados);
  };

  const handleSinPrestar = async (event) => {
    event.preventDefault();
    const sinPrestar = await obtenerTodosInstrumentosSinPrestarByBanda(bandaId);
    setInstrumentos(sinPrestar);
  };

  const handleOpen = (event, newValue) => {
    event.preventDefault();
    setOpen(true);
  };

  const handleEliminar = async (id) => {
    const newInstrumentos = instrumentos.filter(
      (instrumento) => instrumento._id !== id
    );
    setInstrumentos(newInstrumentos);
  };

  useEffect(() => {
    const getInstrumentos = async () => {
      const userreq = await getTodosInstrumentosByBanda(bandaId);
      setInstrumentos(userreq.reverse());
    };
    const getPermiso = async () => {
      const directivoreq = await getDirectivoByUserId(user.uid);
      let condicion = false;
      for (const directivo of directivoreq) {
        if (
          directivo.fecha_final === undefined &&
          directivo.banda === bandaId &&
          directivo.usuario === user.uid
        ) {
          condicion = true;
        }
      }
      setPermiso(condicion);
    };
    getPermiso();
    getInstrumentos();
  }, []);

  if (permiso === "")
    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress aria-label="cargando" size={200} />
        </Box>
      </>
    );
  else {
    return (
      <>
        {permiso === false && <Navigate to="/" />}
        <AñadirInstrumentoModal
          instrumentos={instrumentos}
          setInstrumentos={setInstrumentos}
          open={open}
          handleClose={handleClose}
          setOpen={setOpen}
          banda={bandaId}
        />
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Grid
            xs={9}
            sx={{
              backgroundColor: "#262254",
              color: "white",
              mt: "20px",
              justifyContent: "center",
              display: "flex",
              borderRadius: "10px",
              boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5)",
            }}
            item
          >
            <Typography
              variant="h4"
              sx={{ textAlign: "center", color: "white" }}
            >
              Administración de instrumentos
            </Typography>
          </Grid>
          <Grid
            xs={11}
            sx={{
              mt: "20px",
              justifyContent: "center",
              display: "flex",
              borderRadius: "10px",
            }}
            item
          >
            <Button
              onClick={handleOpen}
              variant="contained"
              align="center"
              sx={{ color: "white" }}
              aria-label="añadir"
            >
              Nuevo
            </Button>
            <Button
              onClick={handleTodos}
              variant="contained"
              align="center"
              sx={{ color: "white", ml: 2 }}
              aria-label="todos"
            >
              Todos
            </Button>
            <Button
              onClick={handlePrestados}
              variant="contained"
              align="center"
              sx={{ color: "white", ml: 2 }}
              aria-label="prestados"
            >
              Prestados
            </Button>
            <Button
              onClick={handleSinPrestar}
              variant="contained"
              align="center"
              sx={{ color: "white", ml: 2 }}
              aria-label="sinprestar"
            >
              Sin Prestar
            </Button>
          </Grid>

          <Grid xs={9} sx={{ mt: "20px", justifyContent: "center" }} item>
            {instrumentos.map((instrumento, index) => (
              <Instrumento
                {...instrumento}
                key={index}
                eliminar={handleEliminar}
                setInstrumentos={setInstrumentos}
                iguales={permiso}
                banda={bandaId}
              />
            ))}
            {instrumentos.length === 0 && (
              <Typography align="center" variant="h4">
                {" "}
                No hay instrumentos...{" "}
              </Typography>
            )}
          </Grid>
        </Grid>
      </>
    );
  }
};
