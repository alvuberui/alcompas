import { Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Navigate, NavLink, useParams } from 'react-router-dom';
import { Banda } from '../../../Components';
import { useAuthStore, useBandasStore } from '../../../hooks';

export const MisBandas = ( { titulo }) => {
  
  const [bandas, setBandas] = useState([]);
  const { getBandasByUserId, getBandasByNombre } = useBandasStore();
  const { nombre } = useParams();
  const { userId } = useParams();
  const { user } = useAuthStore()
  

  useEffect(() => {
    const getBandas = async () => {
      if( titulo == 'Mis Bandas' ){
        const userreq = await getBandasByUserId(userId);
        setBandas(userreq);  
       
   
      } else {
        
        
        const userreq = await getBandasByNombre(nombre);
        setBandas(userreq);  
     
      }
    }
    getBandas();
  }, [ titulo, nombre ]); 

  
  
  return (
    <>
    { userId !== user.uid && titulo === 'Mis Bandas' && <Navigate to='/' />}
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
            sx={{ padding:2, backgroundColor:'primary.main', borderRadius:'5px', boxShadow:' 1px 1px 1px 1px' }}
            >
                <Typography  variant='h4' sx={{textAlign:'center', color:'white'}}>{titulo}: {nombre}</Typography>
            </Grid>
            { titulo === 'Mis Bandas' &&
              <NavLink  style={{textDecoration: "none", color: "black"}}  to='/bandas/crear'>
                <Grid 
                
                item
                xs= { 0.5 }
                sx={{":hover":{} , ml:'15px', minWidth:'40px', backgroundColor:'primary.main', borderRadius:'5px', boxShadow:'1px 1px 1px 1px' }}
                >
                    <Typography  variant='h4' sx={{textAlign:'center', color:'white'}}>+</Typography>
                </Grid>
              </NavLink>
            }

            {bandas.map((banda, index) =>
              <Banda
                { ...banda }
                key={index}
              />
            )}
            

        </Grid>
    </Grid>
    </>
  )
  
}