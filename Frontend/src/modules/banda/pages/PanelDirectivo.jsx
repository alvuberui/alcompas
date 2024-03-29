import { Box, Button, CircularProgress, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NavLink, Navigate, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  useAuthStore,
  useBandasStore,
  useDirectivosStore,
} from "../../../hooks";

export const PanelDirectivo = () => {
  const { bandaId } = useParams();
  const { abandonarBandaDirectivo, getDirectivoByUserId } =
    useDirectivosStore();
  const [presidente, setPresidente] = useState(false);
  const { eliminarBanda, mensajeError } = useBandasStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [permiso, setPermiso] = useState("");

  // Funcion para abandonar una banda como directivo
  const handleAbadonarBanda = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "¿Está seguro de que desea dejar la banda como directivo?",
      text: "Esta acción será irreversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, abandonar banda",
      cancelButtonText: "Cancelar",
    }).then(async (resultado) => {
      if (resultado.value) {
        // Hicieron click en "Sí"
        const c = await abandonarBandaDirectivo(bandaId, user.uid);
        //Redireccionar al inicio
        navigate("/");
      }
    });
  };

  // Funcion para eliminar banda
  const handleEliminarBanda = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "¿Está seguro de que desea eliminar la banda?",
      text: "Esta acción será irreversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar banda",
      cancelButtonText: "Cancelar",
    }).then(async (resultado) => {
      if (resultado.value) {
        // Hicieron click en "Sí"
        const c = await eliminarBanda(bandaId);
        //Redireccionar al inicio
        if (c) {
          navigate("/");
        }
      }
    });
  };

  useEffect(() => {
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
          if (directivo.cargo === "Presidente") {
            setPresidente(true);
          }
        }
      }
      setPermiso(condicion);
    };
    getPermiso();
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
          <CircularProgress size={200} />
        </Box>
      </>
    );
  else {
    return (
      <>
        {permiso === false && <Navigate to="/" />}
        <Grid container justifyContent="center" alignItems="center">
          <Grid
            xs={8}
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
            <h1>Panel Directivo</h1>
          </Grid>

          <Grid
            sx={{
              padding: 2,
              width: "140vh",
              backgroundColor: "#262254",
              color: "white",
              mt: "20px",
              justifyContent: "center",
              display: "flex",
              borderRadius: "10px",
              boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5)",
            }}
            direction="column"
            justifyContent="center"
            alignItems="center"
            container
          >
            <Box textAlign="center" sx={{ mt: "10px", width: "50vh" }}>
              <Button
                variant="contained"
                align="center"
                color="secondary"
                fullWidth
              >
                <NavLink
                  style={{
                    textDecoration: "none",
                    color: "black",
                    fontWeight: "bold",
                  }}
                  to={`/banda/panel/prestamos/${bandaId}`}
                >
                  Administrar Préstamos
                </NavLink>
              </Button>
            </Box>
            <Box textAlign="center" sx={{ mt: "10px", width: "50vh" }}>
              <Button
                variant="contained"
                align="center"
                color="secondary"
                fullWidth
              >
                <NavLink
                  style={{
                    textDecoration: "none",
                    color: "black",
                    fontWeight: "bold",
                  }}
                  to={`/banda/panel/instrumentos/${bandaId}`}
                >
                  Administrar Instrumentos
                </NavLink>
              </Button>
            </Box>
            <Box textAlign="center" sx={{ mt: "10px", width: "50vh" }}>
              <Button
                variant="contained"
                align="center"
                color="secondary"
                fullWidth
              >
                <NavLink
                  style={{
                    textDecoration: "none",
                    color: "black",
                    fontWeight: "bold",
                  }}
                  to={`/banda/panel/vestimentas/${bandaId}`}
                >
                  Administrar Vestimentas
                </NavLink>
              </Button>
            </Box>
            <Box textAlign="center" sx={{ mt: "10px", minWidth: "50vh" }}>
              <Button
                variant="contained"
                align="center"
                color="secondary"
                fullWidth
              >
                <NavLink
                  style={{
                    textDecoration: "none",
                    color: "black",
                    fontWeight: "bold",
                  }}
                  to={`/peticiones/banda/${bandaId}`}
                >
                  Administrar Peticiones
                </NavLink>
              </Button>
            </Box>
            <Box textAlign="center" sx={{ mt: "10px", minWidth: "50vh" }}>
              <Button
                variant="contained"
                align="center"
                color="secondary"
                fullWidth
              >
                <NavLink
                  style={{
                    textDecoration: "none",
                    color: "black",
                    fontWeight: "bold",
                  }}
                  to={`/bandas/actualizar/${bandaId}`}
                >
                  Editar Datos de la Banda
                </NavLink>
              </Button>
            </Box>
            <Box textAlign="center" sx={{ mt: "10px", minWidth: "50vh" }}>
              <Button
                variant="contained"
                align="center"
                color="secondary"
                fullWidth
              >
                <NavLink
                  style={{
                    textDecoration: "none",
                    color: "black",
                    fontWeight: "bold",
                  }}
                  to={`/banda/panel/economia/${bandaId}`}
                >
                  Administrar Economía
                </NavLink>
              </Button>
            </Box>
            <Box textAlign="center" sx={{ mt: "10px", minWidth: "50vh" }}>
              <Button
                variant="contained"
                align="center"
                color="secondary"
                fullWidth
              >
                <NavLink
                  style={{
                    textDecoration: "none",
                    color: "black",
                    fontWeight: "bold",
                  }}
                  to={`/banda/panel/redes/${bandaId}`}
                >
                  Administrar Redes Sociales
                </NavLink>
              </Button>
            </Box>
            <Box textAlign="center" sx={{ mt: "10px", minWidth: "50vh" }}>
              <Button
                variant="contained"
                align="center"
                color="secondary"
                fullWidth
              >
                <NavLink
                  style={{
                    textDecoration: "none",
                    color: "black",
                    fontWeight: "bold",
                  }}
                  to={`/banda/panel/eventos/${bandaId}`}
                >
                  Administrar Eventos
                </NavLink>
              </Button>
            </Box>
            <Box textAlign="center" sx={{ mt: "10px", minWidth: "50vh" }}>
              <Button
                variant="contained"
                align="center"
                color="secondary"
                fullWidth
              >
                <NavLink
                  style={{
                    textDecoration: "none",
                    color: "black",
                    fontWeight: "bold",
                  }}
                  to={`/banda/panel/anuncios/${bandaId}`}
                >
                  Administrar Anuncios
                </NavLink>
              </Button>
            </Box>
            <Box textAlign="center" sx={{ mt: "10px", minWidth: "50vh" }}>
              <Button
                aria-label="abandonar"
                onClick={handleAbadonarBanda}
                variant="contained"
                sx={{ color: "black", fontWeight: "bold" }}
                align="center"
                color="error"
                fullWidth
              >
                Abandonar Banda Como Directivo
              </Button>
            </Box>
            {presidente && (
              <Box
                textAlign="center"
                sx={{ mt: "10px", mb: "10px", minWidth: "50vh" }}
              >
                <Button
                  aria-label="eliminar"
                  onClick={handleEliminarBanda}
                  variant="contained"
                  align="center"
                  color="error"
                  sx={{ color: "black", fontWeight: "bold" }}
                  fullWidth
                >
                  Eliminar Banda
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </>
    );
  }
};
