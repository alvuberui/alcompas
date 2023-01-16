import React from 'react'
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useAuthStore } from '../hooks/useAuthStore';
import {
  BrowserRouter as Router,
  Link,
  NavLink,
}  from "react-router-dom";
import { Buscador } from './Buscador';
import { useUploadsStore } from '../hooks';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));

export const NavBar = () => {

  const { startLogout, user, getUserByiD } = useAuthStore();
  const [ fotoPerfil, setFotoPerfil ] = useState();
  const { getFotoPerfilUsuario } = useUploadsStore();

  useEffect(() => {
    const getFoto = async () => {
        const foto = await getFotoPerfilUsuario(user.uid);
        setFotoPerfil(foto);
    }
    getFoto();
  }, []);

  const cerrarSesion = () => {

    startLogout();
    handleMenuClose();
  }

  const perfil = () => {
    getUserByiD(user.uid);
    handleMenuClose();
  }

  

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

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={perfil} ><NavLink style={{textDecoration: "none", color: "black"}}  to={`/perfil/${user.uid}`}>Perfil</NavLink></MenuItem>
      <MenuItem onClick={handleMenuClose}><NavLink style={{textDecoration: "none", color: "black"}}  to={`/peticiones/${user.uid}`}>Peticiones</NavLink></MenuItem>
      <MenuItem onClick={handleMenuClose}><NavLink style={{textDecoration: "none", color: "black"}}  to={`/bandas/${user.uid}`}>Mis Bandas</NavLink></MenuItem>
      <MenuItem onClick={handleMenuClose}>Mis Préstamos</MenuItem>
      <MenuItem onClick={handleMenuClose}><NavLink style={{textDecoration: "none", color: "black"}}  to={`/admin`}>Administrador</NavLink></MenuItem>
      <MenuItem onClick={cerrarSesion}  href='/'>Cerrar sesión</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      
      <MenuItem>
        
        <p>Peticiones</p>
      </MenuItem>
      <MenuItem>
        
        <p>Estadísticas</p>
      </MenuItem>
      <MenuItem >
        
        <p>Pefil</p>
      </MenuItem>
      <MenuItem >
        
        <p>Préstamos</p>
      </MenuItem>
      <MenuItem >
        
        <p>Bandas</p>
      </MenuItem>
      <MenuItem>
        
        <p>Admin</p>
      </MenuItem>
      <MenuItem >
        <p>Cerrar sesión</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
            <NavLink style={{textDecoration: "none", color: "white"}}  to={"/"}>
              <img
                  src='/../../Resources/Imagenes/logo.png'
                  alt='logo'
                  loading="lazy"
                  width={60}
                  height={50}
                  style={{marginRight: 25 + 'px'}}
              />
            </NavLink>
            <NavLink style={{textDecoration: "none", color: "white"}}  to={"/"}>
            <Typography
                variant="h5"
                noWrap
                component="div"
                sx={{ display: {  xs: 'none', sm: 'block' } }}
            >
            AlCompás
          </Typography>
          </NavLink>
          <Search>
            <Buscador></Buscador>
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <NavLink style={{textDecoration: "none", color: "white"}}  to={"/"}>
          <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ display: {  xs: 'none', sm: 'block' }, mt:1.5, mr:3 }}
                >
                Inicio
            </Typography>
          </NavLink>
            <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ display: {  xs: 'none', sm: 'block' }, mt:1.5, mr:1 }}
                >
                Estadísticas
            </Typography>
            <IconButton
              size="small"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{fontSize:'40px'}}
            >
              { fotoPerfil !== undefined &&
                <Avatar sx={{width:'50px', height:'50px', }} src={`data:image/png;base64, ${fotoPerfil}`} />
              }
              
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
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
  )
}
