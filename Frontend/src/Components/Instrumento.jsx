import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import { usePrestamosStore } from "../hooks";
import { useInstrumentosStore } from "../hooks/useInstrumentosStore";
import { NuevoPrestamo } from "../modules/banda/modals/NuevoPrestamo";
import { AñadirInstrumentoModal } from "../modules/user";

export const Instrumento = ({
  _id,
  instrumento,
  marca,
  modelo,
  numeroSerie,
  usuario,
  setInstrumentos,
  eliminar,
  iguales,
  banda,
}) => {
  // Estados
  const [open, setOpen] = useState(false);
  const [openPrestamo, setOpenPrestamo] = useState(false);
  const [prestamo, setPrestamo] = useState("");
  // Funciones
  const { eliminarInstrumento, eliminarInstrumentoBanda } =
    useInstrumentosStore();
  const { getPrestamoActivoByReferencia, cancelarPrestamo } =
    usePrestamosStore();

  const handleOpenEditar = (event, newValue, editar) => {
    event.preventDefault();
    setOpen(true);
  };
  const handleCloseEditar = (event, newValue) => {
    event.preventDefault();
    setOpen(false);
  };

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

  const handleElminar = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "¿Está seguro de que desea eliminar su comentario?",
      text: "Esta acción será irreversible y no podrá recuperarlo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (resultado) => {
      if (resultado.value) {
        // Hicieron click en "Sí"
        if (banda) {
          await eliminarInstrumentoBanda(_id);
          eliminar(_id);
        } else {
          const c = await eliminarInstrumento(_id);

          eliminar(_id);
        }
      }
    });
  };

  if (banda) {
    // Efectos
    useEffect(() => {
      const getPrestamo = async () => {
        if (_id) {
          const prestamo = await getPrestamoActivoByReferencia(
            _id,
            "Instrumento"
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
    }, [_id]);
  }

  if (prestamo === "" && banda) {
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
        <AñadirInstrumentoModal
          instrumentoId={_id}
          editar={true}
          open={open}
          handleClose={handleCloseEditar}
          setOpen={setOpen}
          setInstrumentos={setInstrumentos}
          banda={banda}
        ></AñadirInstrumentoModal>
        {banda && (
          <NuevoPrestamo
            handleClose={handleClosePrestamo}
            open={openPrestamo}
            setOpen={setOpenPrestamo}
            setPrestamoIns={setPrestamo}
            instrumentoId={_id}
          ></NuevoPrestamo>
        )}
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
              {instrumento}{" "}
            </Typography>
          </>
        </Grid>
        <Grid container>
          <Grid item xs={12} sx={{ padding: 2 }}>
            <div>
              <Typography style={{ display: "inline-block" }}>
                <b>Marca:</b> {marca || "No especificado"}
              </Typography>
              <br></br>
              <Typography style={{ display: "inline-block" }}>
                <b>Modelo:</b> {modelo || "No especificado"}
              </Typography>
              <br></br>
              <Typography style={{ display: "inline-block" }}>
                <b>Número de serie:</b> {numeroSerie || "No especificado"}
              </Typography>
              <br></br>
              {banda && (
                <>
                  {prestamo ? (
                    <Typography style={{ display: "inline-block" }}>
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
                    </Typography>
                  ) : (
                    <Typography style={{ display: "inline-block" }}>
                      <b>Sin prestar</b>
                    </Typography>
                  )}
                </>
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
                  aria-label="Editar"
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
                  aria-label="Eliminar"
                >
                  <Typography sx={{ fontWeight: "bold", fontSize: "12px" }}>
                    Eliminar
                  </Typography>
                </Button>
                {banda && (
                  <>
                    {!prestamo ? (
                      <Button
                        color="primary"
                        onClick={handleOpenPrestamo}
                        sx={{ ml: "5px" }}
                        variant="contained"
                        aria-label="Prestar"
                      >
                        <Typography
                          sx={{ fontWeight: "bold", fontSize: "12px" }}
                        >
                          Prestar
                        </Typography>
                      </Button>
                    ) : (
                      <Button
                        color="primary"
                        onClick={handleCancelarPrestamo}
                        sx={{ ml: "5px" }}
                        variant="contained"
                        aria-label="Cancelar"
                      >
                        <Typography
                          sx={{ fontWeight: "bold", fontSize: "12px" }}
                        >
                          Cancelar
                        </Typography>
                      </Button>
                    )}
                  </>
                )}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    );
  }
};
