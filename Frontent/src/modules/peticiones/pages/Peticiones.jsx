import React from 'react'
import { NavBar, Peticion } from '../../../Components';
import { Grid, Typography, Button, Box, Tabs, Tab } from '@mui/material';
import { usePeticionesStore } from '../../../hooks';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
export const Peticiones = () => {

  const [peticiones, setPeticiones] = useState([]);
  const { getPeticionesByUserId } = usePeticionesStore();
  const { userId } = useParams();

  useEffect(() => {
    const getPeticiones = async () => {
      const userreq = await getPeticionesByUserId(userId);
      setPeticiones(userreq);  
    }
    getPeticiones();
  }, []);
  
  return (
    <>
    <NavBar/>

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
