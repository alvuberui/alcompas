import { Box, Button, Grid } from "@mui/material";
import React, { useEffect } from "react";
import { NavLink, Navigate } from "react-router-dom";
import { useAuthStore } from "../../../hooks";

export const Menu = () => {
  const { user, getUserByiD } = useAuthStore("");
  const [admin, setAdmin] = React.useState(true);

  useEffect(() => {
    const getAdmin = async () => {
      const u = await getUserByiD(user.uid);

      if (u.administrador === false) {
        setAdmin(false);
      }
    };
    getAdmin();
  }, []);

  return (
    <>
      {admin === false && <Navigate to="/" />}
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        display="flex"
      >
        <Grid
          lg={8}
          xs={11}
          justifyContent="center"
          alignItems="center"
          display="flex"
          sx={{
            backgroundColor: "#262254",
            textAlign: "center",
            color: "white",
            mt: "20px",
            borderRadius: "10px",
            boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5)",
          }}
          item
        >
          <h1 style={{ padding: "5px" }} aria-label="h3">
            Panel de Adminitración de la Aplicación
          </h1>
        </Grid>

        <Grid
          lg={8}
          xs={11}
          sx={{
            width: "140vh",
            backgroundColor: "#262254",
            color: "white",
            mt: "20px",
            justifyContent: "center",
            display: "-ms-inline-grid",
            borderRadius: "10px",
            boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5)",
          }}
          alignItems="center"
          justifyContent="center"
          item
        >
          <Box
            alignItems="center"
            justifyContent="center"
            display="flex"
            sx={{ m: "10px", backgroundColor: "#262254" }}
          >
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: "50vh" }}
            >
              <NavLink
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontWeight: "bold",
                }}
                to={`/admin/usuarios`}
              >
                Administrar Usuarios
              </NavLink>
            </Button>
          </Box>
          <Box
            alignItems="center"
            justifyContent="center"
            display="flex"
            sx={{ m: "10px", backgroundColor: "#262254" }}
          >
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: "50vh" }}
            >
              <NavLink
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontWeight: "bold",
                }}
                to={`/admin/bandas`}
              >
                Administrar Bandas
              </NavLink>
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
