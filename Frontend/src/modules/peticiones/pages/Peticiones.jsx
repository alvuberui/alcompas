import { Grid, Typography, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Peticion } from '../../../Components';
import { useAuthStore, usePeticionesStore } from '../../../hooks';

export const Peticiones = ( ) => {

  // Constantes, estados y hooks
  const [peticiones, setPeticiones] = useState([]);
  const { getPeticionesByUserId } = usePeticionesStore();
  const { user } = useAuthStore();
  const { id } = useParams();
  // Funciones


  useEffect(() => {
    const getPeticiones = async () => {
      const userreq = await getPeticionesByUserId(id); 
      setPeticiones(userreq.reverse());      
    }
    getPeticiones();
  }, [peticiones]);

  return (
    <>
    {
      user.uid !== id && <Navigate to="/"/>
    }
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
            sx={{ padding:2, backgroundColor:'primary.main', borderRadius:'5px', boxShadow:'rgba(0, 0, 0, 0.14) 0px 1px 1px 1px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px,  rgba(0, 0, 0, 0.2) 0px 1px 3px 1px', mb:4 }}
            >
                <Typography variant='h4' sx={{textAlign:'center', color:'white'}}>MIS PETICIONES</Typography>
            </Grid>

            {
           
            peticiones.map((peticion, index) =>
              <Peticion
                { ...peticion }
                setPeticiones={setPeticiones}
                tipo={'usuario'}
                key={index}
              />
            )}
            {
              peticiones.length === 0 && <Grid 
              item
              lg={12}
              xs= { 12 }
  
              >
               <Typography align='center' variant='h5'> No hay préstamos... </Typography>
              </Grid>
            }
            
            

        </Grid>
    </Grid>
    </>
  )
}
