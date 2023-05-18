import { Button, Grid, Typography, Box, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { CrearPeticion } from '../';
import { Peticion } from '../../../Components';
import { useAuthStore, useDirectivosStore, usePeticionesStore } from '../../../hooks';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export const PeticionesBanda = ( ) => {

  // Constantes, estados y hooks
  const [peticiones, setPeticiones] = useState([]);
  const [openAñadir, setOpenAñadir] = React.useState(false);
  const { getPeticionesByBandaId } = usePeticionesStore();
  const { getDirectivoByUserId } = useDirectivosStore()
  const [ permiso, setPermiso ] = useState('')
  const { id } = useParams();
  const { user } = useAuthStore();
  const [paginados, setPaginados] = useState([]);

  const [page, setPage] = useState(1);
  const handleChange = (event, value) => {
    setPage(value);
    setPaginados(peticiones.slice((value-1)*10, value*10));
  };

  useEffect(() => {
    const updatePaginados = () => {
      setPaginados(peticiones.slice((page-1)*10, page*10));
    }
    updatePaginados();
  }, [peticiones])


  // Funciones
  const handleOpenCrear = (event, newValue) => {
    event.preventDefault();
    setOpenAñadir(true);
  };

  const handleCloseAñadir = (event, newValue) => {
    event.preventDefault();
    setOpenAñadir(false);
  };

  useEffect(() => {
    const getPeticiones = async () => {
        const bandareq = await getPeticionesByBandaId(id);
        setPeticiones(bandareq.reverse()); 
        setPaginados(bandareq.slice((1-1)*10, 1*10)); 
    }
    const getPermiso = async () => {
      const directivoreq = await getDirectivoByUserId(user.uid);
      let condicion = false
      for( const directivo of directivoreq ) {
       
        if( directivo.fecha_final === undefined && directivo.banda === id && directivo.usuario === user.uid ) {
         
          condicion = true;
        } 
      }
      setPermiso(condicion)
    }
    getPermiso();
    getPeticiones();
  }, []);

  if( permiso === '' ) return (
      <>
    
        <Box sx={{ display: 'flex', justifyContent:"center", alignItems:"center"}}>
            <CircularProgress   size={200} />
        </Box>
    
      </>
  )
  else {
    return (
      <>
      { permiso === false && <Navigate to='/' /> }
      <CrearPeticion open={openAñadir} handleClose={handleCloseAñadir} setOpen={setOpenAñadir} setPeticiones={setPeticiones} peticiones={peticiones}></CrearPeticion>
      <Grid 
          container 
          display="flex"
          justifyContent="center"
          alignItems="baseline"
      >
          <Grid 
          container
          display="flex"
          justifyContent="center"
          alignItems="baseline"
          sx={{minHeight: '50vh', maxWidth:'160vh', padding:4 }}
          >
              <Grid 
              item
            
              xs= { 10 }
              sx={{ padding:2, backgroundColor:'primary.main', borderRadius:'5px', boxShadow:'rgba(0, 0, 0, 0.14) 0px 1px 1px 1px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px,  rgba(0, 0, 0, 0.2) 0px 1px 3px 1px' }}
              >
                  <Typography variant='h4' sx={{textAlign:'center', color:'white'}}>MIS PETICIONES</Typography>
                  
              </Grid>
              <Button color='primary' onClick={handleOpenCrear}  sx={{mt:'5px', width:'30vh' , color:'white'}} variant='contained'>
                      <Typography sx={{ fontWeight: 'bold' }} >Nueva Petición</Typography>
                    </Button>

              { peticiones.length === 0 ?
              <Grid 
              item
              lg={12}
              xs= { 12 }
  
              >
               <Typography align='center' variant='h5'> No hay peticiones... </Typography>
              </Grid>
              :
              paginados.map((peticion, index) =>
      
                <Peticion
                  { ...peticion }
                  setPeticiones={setPeticiones}
                  key={index}
                />
                
              
              )}
              { peticiones.length !== 0 &&
              <Box sx={{ display: 'flex', justifyContent:"center", alignItems:"center", mt:5}}>
              <Stack spacing={2} >
              <Pagination count={ Math.ceil((peticiones.length/10))  } page={page} onChange={handleChange} />
            </Stack>
            </Box>
              }
              
              

          </Grid>
      </Grid>
      </>
    )
  }
}