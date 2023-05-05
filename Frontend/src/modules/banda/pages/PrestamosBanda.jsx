import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button, Grid, Paper, styled, Table, TableBody, TableCell, tableCellClasses,
  TableContainer, TableHead, TableRow, Box, CircularProgress, Typography
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useRedesSocialesStore, useAuthStore, useDirectivosStore, useInstrumentosStore, usePrestamosStore } from '../../../hooks';
import { NuevasRedSocial } from '../modals/NuevasRedSocial';
import { AñadirInstrumentoModal } from '../../user/modals/AñadirInstrumentoModal';
import { Instrumento, Prestamo } from '../../../Components';




export const PrestamosBanda = () => {

  

  // LOS BUENOS
  const [ prestamos , setPrestamos ] = useState([]);
  const { bandaId } = useParams();
  const [ permiso, setPermiso ] = useState('');
  const { user } = useAuthStore();
  const { getDirectivoByUserId } = useDirectivosStore()
  const { obtenerTodosByBanda } = usePrestamosStore();

 
  useEffect(() => {
    const getPrestamos = async () => {
      const  prestamos = await obtenerTodosByBanda(bandaId);
      setPrestamos(prestamos); 
    }
    const getPermiso = async () => {
      const directivoreq = await getDirectivoByUserId(user.uid);
      let condicion = false
      for( const directivo of directivoreq ) {
        if( directivo.fecha_final === undefined && directivo.banda === bandaId && directivo.usuario === user.uid ) {
          condicion = true;
        } 
      }
      setPermiso(condicion)
    }
    getPermiso();
    getPrestamos();
  }, []); 

  if( permiso === '' ) return (
    <>
  
      <Box sx={{ display: 'flex', justifyContent:"center", alignItems:"center"}}>
          <CircularProgress aria-label='cargando'  size={200} />
      </Box>
  
    </>
  )
  else {
    return (
      <>
        { permiso === false && <Navigate to='/' /> }
        <Grid container justifyContent="center" alignItems="center" sx={{mb:2}} >
          <Grid 
          xs = { 9 }
          sx={{ backgroundColor: '#262254', color:'white', mt:'20px', justifyContent: "center", display: "flex", borderRadius: '10px', boxShadow:'5px 5px 10px rgba(0, 0, 0, 0.5)'  }}
          item>
            <h1 >Administración de Préstamos</h1>
          </Grid>
          <Grid 
          xs = { 9 }
          sx={{  mt:'20px', justifyContent: "center", display: '-ms-flexbox' }}
          item>
            {
             
             prestamos.map((pres, index) =>
             <Prestamo 
             prestamo={pres}
             tipo={'banda'}
             key={index}
             />)

            }
            { prestamos.length === 0 && <Typography align='center' variant='h4'> No hay préstamos... </Typography> }
          </Grid>

        </Grid>
      </>
    )
  }
}