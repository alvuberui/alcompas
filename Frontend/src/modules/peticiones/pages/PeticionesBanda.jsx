import { Button, Grid, Typography, Box, CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { CrearPeticion } from '../';
import { Peticion } from '../../../Components';
import { useAuthStore, useDirectivosStore, usePeticionesStore } from '../../../hooks';

export const PeticionesBanda = ( ) => {

  // Constantes, estados y hooks
  const [peticiones, setPeticiones] = useState([]);
  const [openAñadir, setOpenAñadir] = React.useState(false);
  const { getPeticionesByBandaId } = usePeticionesStore();
  const { getDirectivoByUserId } = useDirectivosStore()
  const [ permiso, setPermiso ] = useState('')
  const { id } = useParams();
  const { user } = useAuthStore();

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
  }, [peticiones]);

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
      <CrearPeticion open={openAñadir} handleClose={handleCloseAñadir} setOpen={setOpenAñadir} setPeticiones={setPeticiones}></CrearPeticion>
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
              sx={{ padding:2, backgroundColor:'primary.main', borderRadius:'5px', boxShadow:' 5px 5px 30px' }}
              >
                  <Typography variant='h4' sx={{textAlign:'center', color:'white'}}>MIS PETICIONES</Typography>
                  <Grid 
                  item
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  >
                    <Button color='secondary' onClick={handleOpenCrear}  sx={{mt:'5px', width:'30vh' , backgroundColor:'white', color:'black'}} variant='contained'>
                      <Typography sx={{ fontWeight: 'bold' }} >Nueva Petición</Typography>
                    </Button>
                  </Grid>
              </Grid>

              {peticiones.map((peticion, index) =>
                <Peticion
                  { ...peticion }
                  key={index}
                />
              )}
              

          </Grid>
      </Grid>
      </>
    )
  }
}