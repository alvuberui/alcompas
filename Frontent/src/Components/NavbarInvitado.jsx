import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

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
                <Typography  component="div"  >
                    Iniciar Sesión
                </Typography>
            </Box>
            
                <Typography  component="div"  sx={{  mr: 2, mt:0.5}} >
                    o
                </Typography>
                <Typography  component="div" sx={{ mt:0.5}}>
                    Crear Cuenta
                </Typography>
            
        </Toolbar>
      </AppBar>
    </Box>
  )
}
