import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import { usePrestamosStore, useVestimentasStore } from "../hooks";
import { AñadirVestimenta } from "../modules/banda/modals/AñadirVestimenta";
import { NuevoPrestamo } from "../modules/banda/modals/NuevoPrestamo";

export const Vestimenta = ({
  vestimenta,
  iguales,
  banda,
  setVestimentas,
  eliminar,
}) => {
  // Estados
  const [open, setOpen] = useState(false);
  const [openPrestamo, setOpenPrestamo] = useState(false);
  const [prestamo, setPrestamo] = useState("");

  const { eliminarVestimenta } = useVestimentasStore();
  const { getPrestamoActivoByReferencia, cancelarPrestamo } =
    usePrestamosStore();

  const handleOpenPrestamo = (event, newValue, editar) => {
    event.preventDefault();
    setOpenPrestamo(true);
  };

  const handleClosePrestamo = (event, newValue) => {
    event.preventDefault();
    setOpenPrestamo(false);
  };

  const handleCancelarPrestamo = async (event, newValue) => {
    event.preventDefault();
    Swal.fire({
      title: "¿Está seguro de que desea cancelar el préstamo?",
      text: "Esta acción será irreversible y no podrá recuperarlo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Cancelar",
    }).then(async (resultado) => {
      if (resultado.value) {
        // Hicieron click en "Sí"
        const c = await cancelarPrestamo(prestamo._id);
        if (c) {
          Swal.fire({
            title: "Préstamo cancelado",
            text: "El préstamo ha sido cancelado correctamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
          setPrestamo(undefined);
        }
      }
    });
  };

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
      title: "¿Está seguro de que desea eliminar su vestimenta?",
      text: "Esta acción será irreversible y no podrá recuperarlo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (resultado) => {
      if (resultado.value) {
        // Hicieron click en "Sí"

        await eliminarVestimenta(vestimenta._id);
        eliminar(vestimenta._id);
      }
    });
  };

  useEffect(() => {
    const getPrestamo = async () => {
      if (vestimenta._id) {
        const prestamo = await getPrestamoActivoByReferencia(
          vestimenta._id,
          "Vestimenta"
        );
        if (prestamo) {
          prestamo.fechaInicio = new Date(
            prestamo.fechaInicio
          ).toLocaleDateString();
        }
        setPrestamo(prestamo);
      }
    };
    getPrestamo();
  }, [vestimenta]);

  if (prestamo === "") {
    <CircularProgress size={200}></CircularProgress>;
  } else {
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
        <AñadirVestimenta
          vestimentaAntigua={vestimenta}
          editar={true}
          open={open}
          handleClose={handleCloseEditar}
          setOpen={setOpen}
          setVestimentas={setVestimentas}
          banda={banda}
        ></AñadirVestimenta>
        <NuevoPrestamo
          handleClose={handleClosePrestamo}
          open={openPrestamo}
          setOpen={setOpenPrestamo}
          setPrestamoIns={setPrestamo}
          vestimentaId={vestimenta._id}
        ></NuevoPrestamo>
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
              {vestimenta.tipo}{" "}
            </Typography>
          </>
        </Grid>
        <Grid container>
          <Grid item xs={12} sx={{ padding: 2 }}>
            <div>
              {prestamo ? (
                <>
                  <b>Prestado a: </b>
                  <NavLink
                    to={"/perfil/" + prestamo.usuario._id}
                    style={{ color: "black" }}
                  >
                    {prestamo.usuario.nombre +
                      " " +
                      prestamo.usuario.primer_apellido +
                      " " +
                      prestamo.usuario.segundo_apellido}
                  </NavLink>
                  <br></br>
                  <Typography style={{ display: "inline-block" }}>
                    <b>Comentario del préstamo: </b> {prestamo.comentario}
                  </Typography>
                  <br></br>
                  <Typography style={{ display: "inline-block" }}>
                    <b>Fecha de inicio: </b> {prestamo.fechaInicio}
                  </Typography>
                  <br></br>
                  <Typography style={{ display: "inline-block" }}>
                    <b>Estado del préstamo: </b> {prestamo.estado}
                  </Typography>
                </>
              ) : (
                <Typography style={{ display: "inline-block" }}>
                  <b>No hay información</b>
                </Typography>
              )}
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
                  color="primary"
                  onClick={handleElminar}
                  sx={{ ml: "5px" }}
                  variant="contained"
                >
                  <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>
                    Eliminar
                  </Typography>
                </Button>
                {!prestamo ? (
                  <Button
                    color="primary"
                    onClick={handleOpenPrestamo}
                    sx={{ ml: "5px" }}
                    variant="contained"
                  >
                    <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>
                      Prestar
                    </Typography>
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    onClick={handleCancelarPrestamo}
                    sx={{ ml: "5px" }}
                    variant="contained"
                  >
                    <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>
                      Cancelar
                    </Typography>
                  </Button>
                )}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    );
  }
};
