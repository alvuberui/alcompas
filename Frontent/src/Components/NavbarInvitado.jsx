import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {
  BrowserRouter as Router,
  Link,
  NavLink,
}  from "react-router-dom";

export const NavbarInvitado = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
            <img
                src='/../../Resources/Imagenes/logo.png'
                alt='logo'
                loading="lazy"
                width={60}
                height={50}
                style={{marginRight: 25 + 'px'}}
            />
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5"  component="div" sx={{ flexGrow: 1 }}>
                    AlCompás
                </Typography>
            </Box>
            <Box align='right' sx={{ flexGrow: 1, mr: 2, mt:0.5}}>
              <NavLink style={{textDecoration: "none", color: "white"}}  to={'/auth/login'}>
                <Typography  component="div"  >
                    Iniciar Sesión
                </Typography>
              </NavLink>
            </Box>
              <NavLink style={{textDecoration: "none", color: "white"}}  to={'/auth/register'}>
                <Typography  component="div" sx={{ mt:0.5}}>
                    Crear Cuenta
                </Typography>
              </NavLink>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
