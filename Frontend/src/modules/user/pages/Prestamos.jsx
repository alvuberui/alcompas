import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button, Grid, Paper, styled, Table, TableBody, TableCell, tableCellClasses,
  TableContainer, TableHead, TableRow, Box, CircularProgress, Typography
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useRedesSocialesStore, useAuthStore, useDirectivosStore, useInstrumentosStore, useVestimentasStore, usePrestamosStore } from '../../../hooks';
import { Prestamo } from '../../../Components';





export const Prestamos = () => {


  const [ prestamos , setPrestamos ] = useState([]);
  const [ permiso, setPermiso ] = useState('');
  const { user } = useAuthStore();
  const { obtenerPrestamosUsuario } = usePrestamosStore();

  

  useEffect(() => {
    const getPrestamos = async () => {
      const userreq = await obtenerPrestamosUsuario(user.uid);
      setPrestamos(userreq);  
    }
    getPrestamos();
  }, []); 

  
 
    return (
      <>
        <Grid container justifyContent="center" alignItems="center" >
          <Grid 
          xs = { 9 }
          sx={{ backgroundColor: '#262254', color:'white', mt:'20px', justifyContent: "center", display: "flex", borderRadius: '10px', boxShadow:'5px 5px 10px rgba(0, 0, 0, 0.5)'  }}
          item>
            <h1 >Mis Préstamos</h1>
          </Grid>
          <Grid 
          xs = { 9 }
          sx={{  mt:'20px', justifyContent: "center", display: '-ms-flexbox' }}
          item>

            {
             
             prestamos.map((pres, index) =>
             <Prestamo 
             prestamo={pres}
             key={index}
             />)

            }
            {
              prestamos.length === 0 &&
              <Grid
              container
              display="flex"
              justifyContent="center"
              alignItems="center"
              >
                <Typography variant='h6' sx={{fontWeight: 'bold', textAlign:'center', color:'black'}}>{'No tienes préstamos'}</Typography>
              </Grid>

            }
            
          </Grid>

        </Grid>
      </>
    )
}
