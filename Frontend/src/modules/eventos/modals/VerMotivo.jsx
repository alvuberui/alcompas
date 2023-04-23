import React from 'react'
import { Box, Button, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vh',
    bgcolor: '#262254',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
    display:'flex',
    alignContent:'center',
    justifyContent:'center'
};

export const VerMotivo = ({ open, handleClose, motivo }) => {
  return (
    <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          id="cambiar-contraseña"
        >
            <Box sx={style} >
                
                    
                    <Grid container spacing={2} display={'flex'} alignContent={'center'} justifyContent={'center'} >
                        <Grid item xs={12} >
                            <Typography variant="h5" component="h2"  display={'flex'} alignContent={'center'} justifyContent={'center'} sx={{color: 'white'}} >
                                Comentario de la asistencia:
                            </Typography>
                        </Grid>
                        <Grid item xs={12} >
                            <Typography variant="h6" display={'flex'} alignContent={'center'} justifyContent={'center'} component="h2" sx={{color: 'white'}} >
                                {
                                motivo === '' ? 'No hay comentario' : motivo
                                }
                            </Typography>
                        </Grid>
                        <Grid item xs={12} display={'flex'} alignContent={'center'} justifyContent={'center'}>
                            <Button variant="contained" color='secondary' onClick={handleClose} >
                                Cerrar
                            </Button>
                        </Grid>
                    </Grid>
            </Box>
            
    </Modal>        
  )
}
