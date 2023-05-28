import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Noticia } from "../../../Components";
import {
  useAnunciosStore,
  useAuthStore,
  useDirectivosStore,
} from "../../../hooks";
import { NuevoAnuncio } from "../modals/NuevoAnuncio";

export const Anuncios = () => {
  // LOS BUENOS
  const [anuncios, setAnuncios] = useState([]);
  const { bandaId } = useParams();
  const [permiso, setPermiso] = useState("");
  const { user } = useAuthStore();
  const { getDirectivoByUserId } = useDirectivosStore();
  const { getNoticiasByBanda } = useAnunciosStore();
  const [open, setOpen] = useState(false);
  const [paginados, setPaginados] = useState([]);

  const [page, setPage] = useState(1);
  const handleChange = (event, value) => {
    setPage(value);
    setPaginados(anuncios.slice((value - 1) * 5, value * 5));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const updatePaginados = () => {
      setPaginados(anuncios.slice((page - 1) * 5, page * 5));
    };
    updatePaginados();
  }, [anuncios]);

  useEffect(() => {
    const getAnuncios = async () => {
      const anuncios = await getNoticiasByBanda(bandaId);
      setAnuncios(anuncios);
      setPaginados(anuncios.slice((1 - 1) * 5, 1 * 5));
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
    getAnuncios();
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
        <NuevoAnuncio
          handleClose={handleClose}
          open={open}
          setAnuncios={setAnuncios}
          setOpen={setOpen}
        />
        {permiso === false && <Navigate to="/" />}
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
              Administración de noticias
            </Typography>
          </Grid>

          <Grid
            xs={11}
            sx={{
              mt: "20px",
              justifyContent: "center",
              display: "-ms-flexbox",
            }}
            item
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                aria-label="añadir"
                color="primary"
                onClick={handleOpen}
                sx={{ mx: "auto", mb: "5px", width: "30vh", maxWidth: "4opx" }}
                variant="contained"
              >
                <Typography sx={{ fontWeight: "bold" }}>
                  Añadir Noticia
                </Typography>
              </Button>
            </Box>
            {paginados.map((pres, index) => (
              <Noticia
                noticia={pres}
                setNoticias={setAnuncios}
                index={index}
                key={index}
              />
            ))}
            {anuncios.length === 0 && (
              <Typography align="center" variant="h6">
                {" "}
                No hay anuncios...{" "}
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
                  count={Math.ceil(anuncios.length / 5)}
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
