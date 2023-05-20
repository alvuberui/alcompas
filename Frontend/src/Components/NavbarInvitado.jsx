import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { NavLink } from "react-router-dom";

export const NavbarInvitado = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <img
            src="/Imagenes/logo.png"
            alt="logo"
            loading="lazy"
            width={60}
            height={50}
            style={{ marginRight: 25 + "px" }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
              AlCompás
            </Typography>
          </Box>

          <NavLink
            style={{ textDecoration: "none", color: "white" }}
            to={"/auth/login"}
          >
            <Typography component="div" style={{ textAlign: "center" }}>
              Iniciar Sesión
            </Typography>
          </NavLink>

          <NavLink
            style={{ textDecoration: "none", color: "white" }}
            to={"/auth/register"}
          >
            <Typography
              component="div"
              sx={{ ml: "20px" }}
              style={{ textAlign: "center" }}
            >
              Crear Cuenta
            </Typography>
          </NavLink>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
