import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button, Grid, Paper, styled, Table, TableBody, TableCell, tableCellClasses,
  TableContainer, TableHead, TableRow, Box, CircularProgress
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useRedesSocialesStore, useAuthStore, useDirectivosStore } from '../../../hooks';
import { NuevasRedSocial } from '../modals/NuevasRedSocial';
import { NuevoTransaccion } from '../modals/NuevaTransaccion';

export const Transacciones = () => {

    // Estados
    const [ transacciones, setTransacciones ] = React.useState([]);
    const [ open, setOpen ] = React.useState(false);

    // Hooks



    const handleClose = (event, newValue) => {
        event.preventDefault();
        setOpen(false);
    };
    
    
    const handleOpen = (event, newValue) => {
        event.preventDefault();
        setOpen(true);
    };

  return (
    <>
        <NuevoTransaccion handleClose={handleClose} open={open}  setOpen={setOpen} setTransacciones={setTransacciones}/>
        <Grid container justifyContent="center" alignItems="center" >
            <Grid 
            xs = { 9 }
            sx={{ backgroundColor: '#262254', color:'white', mt:'20px', justifyContent: "center", display: "flex", borderRadius: '10px', boxShadow:'5px 5px 10px rgba(0, 0, 0, 0.5)'  }}
            item>
                <h1 >Administración económica</h1>
            </Grid>
            <Grid 
            xs = { 4 }
            sx={{ backgroundColor: '#262254', color:'white', mt:'20px', justifyContent: "center", display: "flex", borderRadius: '10px', boxShadow:'5px 5px 10px rgba(0, 0, 0, 0.5)'  }}
            item>
                <Button onClick={handleOpen} variant='contained' align="center" sx={{color:'white'}} fullWidth >Añadir Transacción</Button>
            </Grid>

            <Grid 
            xs = { 9 }
            sx={{ backgroundColor: '#262254', color:'white', mt:'20px', justifyContent: "center", display: "flex", borderRadius: '10px', boxShadow:'5px 5px 10px rgba(0, 0, 0, 0.5)'  }}
            item>
                
            </Grid>

        </Grid>
      </>
  )
}
