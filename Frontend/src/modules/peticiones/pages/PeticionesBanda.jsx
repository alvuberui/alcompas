import React from 'react'
import { NavBar, Peticion } from '../../../Components';
import { Grid, Typography, Button, Box, Tabs, Tab } from '@mui/material';
import { usePeticionesStore } from '../../../hooks';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CrearPeticion } from '../';

export const PeticionesBanda = ( ) => {

  // Constantes, estados y hooks
  const [peticiones, setPeticiones] = useState([]);
  const [openAñadir, setOpenAñadir] = React.useState(false);
  const { getPeticionesByBandaId } = usePeticionesStore();
  const { id } = useParams();

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
    getPeticiones();
  }, [peticiones]);
  
  return (
    <>
    <NavBar/>
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