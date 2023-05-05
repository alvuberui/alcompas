import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button, Grid, Paper, styled, Table, TableBody, TableCell, tableCellClasses,
  TableContainer, TableHead, TableRow, Box, CircularProgress, Typography
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useRedesSocialesStore, useAuthStore, useDirectivosStore, useInstrumentosStore, useVestimentasStore } from '../../../hooks';
import { NuevasRedSocial } from '../modals/NuevasRedSocial';
import { AñadirInstrumentoModal } from '../../user/modals/AñadirInstrumentoModal';
import { Instrumento } from '../../../Components';
import { AñadirVestimenta } from '../modals/AñadirVestimenta';
import { Vestimenta } from '../../../Components';




export const Vestimentas = () => {


  const [ vestimentas , setVestimentas ] = useState([]);
  const [ open, setOpen ] = React.useState(false);
  const { bandaId } = useParams();
  const [ permiso, setPermiso ] = useState('');
  const { user } = useAuthStore();
  const { getDirectivoByUserId } = useDirectivosStore()
  const { getAllVestimentasByBanda, obtenerTodosConPrestamosByBanda, obtenerTodosVestimentasSinPrestarByBanda } = useVestimentasStore();

  const handleClose = (event, newValue) => {
    event.preventDefault();
    setOpen(false);
  };

  const handleTodos = async(event) => {
    event.preventDefault();
    const todos = await getAllVestimentasByBanda(bandaId);
    setVestimentas(todos);
  };

  const handlePrestados = async(event) => {
    event.preventDefault();
    const prestados = await obtenerTodosConPrestamosByBanda(bandaId);
    setVestimentas(prestados);
  };

  const handleSinPrestar = async(event) => {
    event.preventDefault();
    const sinPrestar = await obtenerTodosVestimentasSinPrestarByBanda(bandaId);
    setVestimentas(sinPrestar);
  };


  const handleOpen = (event, newValue) => {
    event.preventDefault();
    setOpen(true);
  };

  const handleEliminar = async(id) => {
    const newVestimentas = vestimentas.filter( vestimenta => vestimenta._id !== id );
    setVestimentas(newVestimentas);
  };

  useEffect(() => {
    const getVestimentas = async () => {
      const userreq = await getAllVestimentasByBanda(bandaId);
      setVestimentas(userreq);  
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
    getVestimentas();
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
        <AñadirVestimenta open={open} handleClose={handleClose} setOpen={setOpen} banda={bandaId} setVestimentas={setVestimentas} />
        <Grid container justifyContent="center" alignItems="center" sx={{mb:2}}>
          <Grid 
          xs = { 9 }
          sx={{ backgroundColor: '#262254', color:'white', mt:'20px', justifyContent: "center", display: "flex", borderRadius: '10px', boxShadow:'5px 5px 10px rgba(0, 0, 0, 0.5)'  }}
          item>
            <h1 >Administración de Vestimentas</h1>
          </Grid>
          <Grid 
          xs = { 4 }
          sx={{  mt:'20px', justifyContent: "center", display: "flex", borderRadius: '10px'  }}
          item>
            <Button onClick={handleOpen} variant='contained' align="center" sx={{color:'white'}} fullWidth >Añadir Vestimenta</Button>
            <Button onClick={handleTodos} variant='contained' align="center" sx={{color:'white', ml:2}} fullWidth >Todas</Button>
            <Button onClick={handlePrestados} variant='contained' align="center" sx={{color:'white', ml:2}} fullWidth >Prestadas</Button>
            <Button onClick={handleSinPrestar} variant='contained' align="center" sx={{color:'white', ml:2}} fullWidth >Sin Prestar</Button>
          </Grid>

          <Grid 
          xs = { 9 }
          sx={{  mt:'20px', justifyContent: "center" }}
          item>

            {
             
             vestimentas.map((vestimenta, index) =>
             <Vestimenta 
             vestimenta={vestimenta}
             key={index}
             eliminar={handleEliminar}
             setVestimentas={setVestimentas}
             iguales={permiso}
             banda={bandaId}
             />)

            }
            {
              vestimentas.length === 0 && <Typography variant='h5' align='center'>No hay vestimentas...</Typography>
            }
            
          </Grid>

        </Grid>
      </>
    )
  }
}
