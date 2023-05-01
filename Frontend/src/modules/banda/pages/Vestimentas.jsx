import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button, Grid, Paper, styled, Table, TableBody, TableCell, tableCellClasses,
  TableContainer, TableHead, TableRow, Box, CircularProgress
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
  const { getTodosInstrumentosByBanda } = useInstrumentosStore();
  const { getAllVestimentasByBanda } = useVestimentasStore();

  const handleClose = (event, newValue) => {
    event.preventDefault();
    setOpen(false);
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
        <Grid container justifyContent="center" alignItems="center" >
          <Grid 
          xs = { 9 }
          sx={{ backgroundColor: '#262254', color:'white', mt:'20px', justifyContent: "center", display: "flex", borderRadius: '10px', boxShadow:'5px 5px 10px rgba(0, 0, 0, 0.5)'  }}
          item>
            <h1 >Administración de Vestimentas</h1>
          </Grid>
          <Grid 
          xs = { 4 }
          sx={{ backgroundColor: '#262254', color:'white', mt:'20px', justifyContent: "center", display: "flex", borderRadius: '10px', boxShadow:'5px 5px 10px rgba(0, 0, 0, 0.5)'  }}
          item>
            <Button onClick={handleOpen} variant='contained' align="center" sx={{color:'white'}} fullWidth >Añadir Vestimenta</Button>
          </Grid>

          <Grid 
          xs = { 9 }
          sx={{  mt:'20px', justifyContent: "center", display: "flex"  }}
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
            
          </Grid>

        </Grid>
      </>
    )
  }
}
