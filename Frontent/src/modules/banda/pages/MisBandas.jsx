import React from 'react'
import { NavBar, Banda } from '../../../Components';
import { Grid, Typography, Button, Box, Tabs, Tab } from '@mui/material';
import { useBandasStore } from '../../../hooks';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  BrowserRouter as Router,
  Link,
  NavLink,
}  from "react-router-dom";

export const MisBandas = ( titulo ) => {
  
  const [bandas, setBandas] = useState([]);
  const { getBandasByUserId, getBandasByNombre } = useBandasStore();

  if( titulo.titulo == 'Mis Bandas' ){
    const { userId } = useParams();
    
    useEffect(() => {
      const getBandas = async () => {
        const userreq = await getBandasByUserId(userId);
        setBandas(userreq);  
      }
      getBandas();
    }, []); 
  } else {
    const { nombre } = useParams();
    useEffect(() => {
      const getBandas = async () => {
        const userreq = await getBandasByNombre(nombre);
        setBandas(userreq);  
      }
      getBandas();
    }, [ nombre ]); 
  }
  
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
            sx={{ padding:2, backgroundColor:'primary.main', borderRadius:'5px', boxShadow:' 1px 1px 1px 1px' }}
            >
                <Typography variant='h4' sx={{textAlign:'center', color:'white'}}>MIS BANDAS</Typography>
            </Grid>
            { titulo.titulo === 'Mis Bandas' &&
              <NavLink style={{textDecoration: "none", color: "black"}}  to='/bandas/crear'>
                <Grid 
                item
                xs= { 0.5 }
                sx={{":hover":{} , ml:'15px', minWidth:'40px', backgroundColor:'primary.main', borderRadius:'5px', boxShadow:'1px 1px 1px 1px' }}
                >
                    <Typography variant='h4' sx={{textAlign:'center', color:'white'}}>+</Typography>
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