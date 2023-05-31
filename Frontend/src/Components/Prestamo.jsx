import { CircularProgress, Grid, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

export const Prestamo = ({ prestamo, tipo }) => {
  if (!prestamo) {
    return(
    <CircularProgress aria-label="loading" size={200}></CircularProgress>);
  } else {
    const fecha = new Date(prestamo.fechaInicio).toLocaleDateString();

    return (
      <Grid
        container
        sx={{
          mt: "15px",
          backgroundColor: "white",
          borderRadius: "5px",
          borderColor: "white",
          boxShadow:
            "rgba(0, 0, 0, 0.14) 0px 1px 1px 1px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px,  rgba(0, 0, 0, 0.2) 0px 1px 3px 1px",
        }}
      >
        <Grid
          container
          display="flex"
          justifyContent="center"
          alignItems="baseline"
        >
          <>
            {tipo === "banda" ? (
              <NavLink
                to={`/perfil/${prestamo.usuario._id}`}
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "black",
                  }}
                >
                  {"Préstamo de " +
                    prestamo.tipo +
                    " - " +
                    prestamo.usuario.nombre +
                    " " +
                    prestamo.usuario.primer_apellido +
                    " " +
                    prestamo.usuario.segundo_apellido}{" "}
                </Typography>
              </NavLink>
            ) : (
              <NavLink
                to={`/banda/${prestamo.referencia.banda._id}`}
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontWeight: "bold",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "black",
                  }}
                >
                  {"Préstamo de " +
                    prestamo.tipo +
                    " - " +
                    prestamo.referencia.banda.tipo +
                    " " +
                    prestamo.referencia.banda.nombre}{" "}
                </Typography>
              </NavLink>
            )}
          </>
        </Grid>
        <Grid container>
          <Grid item xs={12} sx={{ padding: 2 }}>
            <div>
              <Typography style={{ display: "inline-block" }}>
                <b>Estado:</b> {prestamo.estado}
              </Typography>
              <br />
              <Typography style={{ display: "inline-block" }}>
                <b>Fecha de inicio:</b> {fecha}
              </Typography>
              <br />
              <Typography style={{ display: "inline-block" }}>
                <b>Comentario:</b>{" "}
                {prestamo.comentario ? prestamo.comentario : "Sin comentario"}
              </Typography>
              <br />
              {prestamo.tipo === "Instrumento" && (
                <Typography style={{ display: "inline-block" }}>
                  <b>Instrumento:</b> {prestamo.referencia.instrumento}{" "}
                  {prestamo.referencia.marca && prestamo.referencia.marca}{" "}
                  {prestamo.referencia.modelo && prestamo.referencia.modelo}{" "}
                  {prestamo.referencia.numeroSerie &&
                    prestamo.referencia.numeroSerie}
                </Typography>
              )}
              {prestamo.tipo === "Vestimenta" && (
                <Typography style={{ display: "inline-block" }}>
                  <b>Vestimenta:</b> {prestamo.referencia.tipo}
                </Typography>
              )}
            </div>
          </Grid>
        </Grid>
      </Grid>
    );
  }
};
