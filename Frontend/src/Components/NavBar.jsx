import MoreIcon from "@mui/icons-material/MoreVert";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { alpha, styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useUploadsStore } from "../hooks";
import { useAuthStore } from "../hooks/useAuthStore";
import { Buscador } from "./Buscador";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

export const NavBar = () => {
  const { startLogout, user, getUserByiD } = useAuthStore();
  const [fotoPerfil, setFotoPerfil] = useState("");
  const { getFotoPerfilUsuario } = useUploadsStore();
  const [admin, setAdmin] = useState("");
  
  useEffect(() => {
    const getFoto = async () => {
        const foto = await getFotoPerfilUsuario(user.uid);
        setFotoPerfil(foto);
    };
    const getAdmin = async () => {
      const u = await getUserByiD(user.uid);
      if (u.administrador) {
        setAdmin(true);
      } else {
        setAdmin(false);
      }
    };
    getAdmin();
    getFoto();
  }, [user]);

  const cerrarSesion = () => {

    startLogout();
    handleMenuClose();
  };

  const perfil = () => {
    getUserByiD(user.uid);
    handleMenuClose();
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <NavLink
        style={{ textDecoration: "none", color: "black" }}
        to={`/perfil/${user.uid}`}
      >
        <MenuItem onClick={perfil} sx={{ justifyContent: "center" }}>
          Perfil
        </MenuItem>
      </NavLink>
      <NavLink
        style={{ textDecoration: "none", color: "black" }}
        to={`/peticiones/${user.uid}`}
      >
        <MenuItem onClick={handleMenuClose} sx={{ justifyContent: "center" }}>
          Peticiones
        </MenuItem>
      </NavLink>
      <NavLink
        style={{ textDecoration: "none", color: "black" }}
        to={`/bandas/${user.uid}`}
      >
        <MenuItem onClick={handleMenuClose} sx={{ justifyContent: "center" }}>
          Mis Bandas
        </MenuItem>
      </NavLink>
      <NavLink
        style={{ textDecoration: "none", color: "black" }}
        to={`/prestamos/${user.uid}`}
      >
        <MenuItem onClick={handleMenuClose} sx={{ justifyContent: "center" }}>
          Mis Préstamos
        </MenuItem>
      </NavLink>
      {admin && (
        <NavLink
          style={{ textDecoration: "none", color: "black" }}
          to={`/admin`}
        >
          <MenuItem onClick={handleMenuClose} sx={{ justifyContent: "center" }}>
            Administrador
          </MenuItem>
        </NavLink>
      )}
      <MenuItem
        onClick={cerrarSesion}
        sx={{ justifyContent: "center", color: "red" }}
        href="/"
      >
        Cerrar sesión
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <NavLink
        style={{ textDecoration: "none", color: "black" }}
        to={`/perfil/${user.uid}`}
      >
        <MenuItem
          aria-label="perfil"
          onClick={perfil}
          sx={{ justifyContent: "center" }}
        >
          Perfil
        </MenuItem>
      </NavLink>
      <NavLink
        style={{ textDecoration: "none", color: "black" }}
        to={`/peticiones/${user.uid}`}
      >
        <MenuItem onClick={handleMenuClose} sx={{ justifyContent: "center" }}>
          Peticiones
        </MenuItem>
      </NavLink>
      <NavLink
        style={{ textDecoration: "none", color: "black" }}
        to={`/bandas/${user.uid}`}
      >
        <MenuItem onClick={handleMenuClose} sx={{ justifyContent: "center" }}>
          Mis Bandas
        </MenuItem>
      </NavLink>
      <NavLink
        style={{ textDecoration: "none", color: "black" }}
        to={`/prestamos/${user.uid}`}
      >
        <MenuItem onClick={handleMenuClose} sx={{ justifyContent: "center" }}>
          Mis Préstamos
        </MenuItem>
      </NavLink>
      <NavLink
        style={{ textDecoration: "none", color: "black" }}
        to={`/estadisticas`}
      >
        <MenuItem onClick={handleMenuClose} sx={{ justifyContent: "center" }}>
          Estadísticas
        </MenuItem>
      </NavLink>
      {admin && (
        <NavLink
          style={{ textDecoration: "none", color: "black" }}
          to={`/admin`}
        >
          <MenuItem onClick={handleMenuClose} sx={{ justifyContent: "center" }}>
            Administrador
          </MenuItem>
        </NavLink>
      )}

      <MenuItem
        aria-label="logout"
        onClick={cerrarSesion}
        sx={{ justifyContent: "center", color: "red" }}
        href="/"
      >
        Cerrar sesión
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <NavLink style={{ textDecoration: "none", color: "white" }} to={"/"}>
            <img
              src="/Imagenes/logo.png"
              alt="logo"
              loading="lazy"
              width={60}
              height={50}
              style={{ marginRight: 25 + "px" }}
            />
          </NavLink>
          <NavLink style={{ textDecoration: "none", color: "white" }} to={"/"}>
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              AlCompás
            </Typography>
          </NavLink>
          <Search style={{ width: "300px" }}>
            <Buscador freeSolo={true}></Buscador>
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <NavLink
              style={{ textDecoration: "none", color: "white" }}
              to={"/"}
            >
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: "none", sm: "block" }, mt: 1.5, mr: 3 }}
              >
                Inicio
              </Typography>
            </NavLink>
            <NavLink
              style={{ textDecoration: "none", color: "white" }}
              to={"/estadisticas"}
            >
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: "none", sm: "block" }, mt: 1.5, mr: 1 }}
              >
                Estadísticas
              </Typography>
            </NavLink>
            <IconButton
              size="small"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{ fontSize: "40px" }}
            >
              {fotoPerfil !== undefined && (
                <Avatar
                  loading={"lazy"}
                  sx={{ width: "50px", height: "50px" }}
                  src={`data:image/png;base64, ${fotoPerfil}`}
                />
              )}
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
};
