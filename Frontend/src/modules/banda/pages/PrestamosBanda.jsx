import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Prestamo } from "../../../Components";
import {
  useAuthStore,
  useDirectivosStore,
  usePrestamosStore,
} from "../../../hooks";

export const PrestamosBanda = () => {
  // LOS BUENOS
  const [prestamos, setPrestamos] = useState([]);
  const { bandaId } = useParams();
  const [permiso, setPermiso] = useState("");
  const { user } = useAuthStore();
  const { getDirectivoByUserId } = useDirectivosStore();
  const { obtenerTodosByBanda } = usePrestamosStore();
  const [paginados, setPaginados] = useState([]);

  const [page, setPage] = useState(1);
  const handleChange = (event, value) => {
    setPage(value);
    setPaginados(prestamos.slice((value - 1) * 10, value * 10));
  };

  useEffect(() => {
    const getPrestamos = async () => {
      const prestamos = await obtenerTodosByBanda(bandaId);
      setPrestamos(prestamos.reverse());
      setPaginados(prestamos.slice((1 - 1) * 10, 1 * 10));
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
    getPrestamos();
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
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          display="flex"
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
              Administración de préstamos
            </Typography>
          </Grid>
          <Grid
            xs={9}
            sx={{
              mt: "20px",
              justifyContent: "center",
              display: "-ms-flexbox",
            }}
            item
          >
            {paginados.map((pres, index) => (
              <Prestamo prestamo={pres} tipo={"banda"} key={index} />
            ))}
            {prestamos.length === 0 && (
              <Typography align="center" variant="h4">
                {" "}
                No hay préstamos...{" "}
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: 5,
              }}
            >
              <Stack spacing={2}>
                <Pagination
                  count={Math.ceil(prestamos.length / 10)}
                  page={page}
                  onChange={handleChange}
                />
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </>
    );
  }
};
