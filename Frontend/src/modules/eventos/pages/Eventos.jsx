import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Calendario } from "../../../Components";
import {
  useAuthStore,
  useDirectivosStore,
  useTransaccionesStore,
} from "../../../hooks";
import { NuevoTransaccion } from "../../banda/modals/NuevaTransaccion";

export const Eventos = () => {
  // Estados
  const [transaccion, setTransaccion] = React.useState(undefined);
  const [open, setOpen] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [esDirectivo, setEsDirectivo] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Hooks
  const { bandaId } = useParams();
  const { user } = useAuthStore();
  const { getDirectivoByUserId } = useDirectivosStore();

  const handleClose = (event, newValue) => {
    event.preventDefault();
    setOpenEditar(false);
    setTransaccion(undefined);
    setOpen(false);
  };


  const renviarCrear = async (event) => {
    event.preventDefault();
    navigate("/banda/panel/eventos/crear/" + bandaId);
  };


  useEffect(() => {
    const getDirectivo = async () => {
      const directivos = await getDirectivoByUserId(user.uid);
      for (let i = 0; i < directivos.length; i++) {
        if (directivos[i].banda === bandaId && !directivos[i].fecha_final) {
          setEsDirectivo(true);
        }
      }
      setLoading(false);
    };
    getDirectivo();
  }, []);

  if (loading) {
    return <CircularProgress />;
  } else {
    return (
      <>
        {esDirectivo === false && <Navigate to="/" />}
        <NuevoTransaccion
          handleClose={handleClose}
          open={open}
          setOpen={setOpen}
          setTransacciones={setTransacciones}
          editar={openEditar}
          transaccion={transaccion}
          setTotal={setTotal}
          setOpenEditar={setOpenEditar}
        />
        <Grid container justifyContent="center" alignItems="center">
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
            <Typography variant="h4" align="center" sx={{ fontWeight: "bold" }}>
              Administración de Eventos
            </Typography>
          </Grid>
          {esDirectivo && (
            <Grid
              xs={4}
              sx={{
                backgroundColor: "#262254",
                color: "white",
                mt: "20px",
                mb: "30px",
                justifyContent: "center",
                display: "flex",
                borderRadius: "10px",
                boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5)",
              }}
              item
            >
              <Button
                onClick={renviarCrear}
                variant="contained"
                align="center"
                sx={{ color: "white" }}
                fullWidth
                aria-label="add"
              >
                Añadir Evento
              </Button>
            </Grid>
          )}
          <Grid xs={10} item>
            <Calendario tipo="perfil"></Calendario>
          </Grid>
        </Grid>
      </>
    );
  }
};
