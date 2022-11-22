
import { Grid, Typography, Button, Checkbox, FormControlLabel, Box, Tabs, Tab } from '@mui/material';
import * as React from 'react';
import { NavBar } from '../../../Components';
import { useAuthStore } from '../../../hooks/useAuthStore';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import {  TextField } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50vh',
    bgcolor: '#262254',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
  };
  
export const CambiarContraseña = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

  return (
    <div>
       
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography  sx={{textAlign:'center', color:'white', textDecoration:'underline'}} id="modal-modal-title" variant="h4" component="h2">
              Cambiar Contraseña
            </Typography>
            <form>
                <Grid container>
        
                    <Grid item xs={ 12 } sx={{ mt: 2}}>
                    <Typography  sx={{ color:'white'}} >
                      Contraseña actual
                    </Typography>
                    <TextField 
                        sx={{ input: { color: 'white' }}}
                        type="password"
                        placeholder="Contraseña actual"
                        fullWidth
                        focused
                        style={{ border: '1px solid #e2e2e1', borderRadius:'5px'}}
                        
                    />
                    </Grid>
                    <Grid item xs={ 12 } sx={{ mt: 2}}>
                    <Typography  sx={{ color:'white'}} >
                      Nueva contraseña
                    </Typography>
                    <TextField 
                        sx={{ input: { color: 'white' }}}
                        type="password"
                        placeholder="Nueva contraseña"
                        fullWidth
                        focused
                        style={{ border: '1px solid #e2e2e1', borderRadius:'5px'}}
                        
                    />
                    </Grid>
                    <Grid item xs={ 12 } sx={{ mt: 2}}>
                    <Typography  sx={{ color:'white'}} >
                      Confirmar nueva contraseña
                    </Typography>
                    <TextField 
                        sx={{ input: { color: 'white' }}}
                        type="password"
                        placeholder="Confirmar nueva contraseña"
                        fullWidth
                        focused
                        style={{ border: '1px solid #e2e2e1', borderRadius:'5px'}}
                        
                    />
                    </Grid>
                    <Grid item  xs={ 12 } sx={{ mt: 2}}>
                      <Typography variant='h7'  sx={{ color:'white'}} >
                        * Esta modificación será irreversible y ya no podrá deshacerla.
                      </Typography>
                    </Grid>
                    <Box  sx={{mt:2, display:'flex', alignContent:'center', justifyContent:'center'}}>
                      <Button color='secondary' sx={{ backgroundColor:'white', color:'black' }} variant='contained' fullWidth type='submit'>
                        Iniciar Sesión
                      </Button>
                    </Box>
                </Grid>
            </form>
          </Box>
        </Modal>
      </div>
  )
}
