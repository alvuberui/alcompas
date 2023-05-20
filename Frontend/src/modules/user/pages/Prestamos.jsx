import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Prestamo } from "../../../Components";
import { useAuthStore, usePrestamosStore } from "../../../hooks";

export const Prestamos = () => {
  const [prestamos, setPrestamos] = useState([]);
  const { user } = useAuthStore();
  const { obtenerPrestamosUsuario } = usePrestamosStore();

  useEffect(() => {
    const getPrestamos = async () => {
      const userreq = await obtenerPrestamosUsuario(user.uid);
      setPrestamos(userreq.reverse());
    };
    getPrestamos();
  }, []);

  return (
    <>
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
          <h1>Mis Préstamos</h1>
        </Grid>
        <Grid
          xs={9}
          sx={{ mt: "20px", justifyContent: "center", display: "-ms-flexbox" }}
          item
        >
          {prestamos.map((pres, index) => (
            <Prestamo prestamo={pres} key={index} />
          ))}
          {prestamos.length === 0 && (
            <Grid item lg={12} xs={12}>
              <Typography align="center" variant="h5">
                {" "}
                No hay préstamos...{" "}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
};
