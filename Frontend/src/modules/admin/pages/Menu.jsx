import { Grid, Box, Button } from '@mui/material'
import React from 'react'
import { NavBar } from '../../../Components'
import {
    BrowserRouter as Router,
    Link,
    NavLink,
}  from "react-router-dom";
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuthStore, useBandasStore, useDirectivosStore } from '../../../hooks';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const Menu = () => {
  return (
    <>
        <Grid
            container
            alignItems="center"
            justifyContent="center"
            display="flex"
        >
            <Grid 
                xs = { 8 }
                justifyContent="center"
                alignItems="center" 
                display="flex"
                sx={{ backgroundColor: '#262254', textAlign:'center', color:'white', mt:'20px', borderRadius: '10px', boxShadow:'5px 5px 10px rgba(0, 0, 0, 0.5)'  }}
                item>
                <h1 >Panel de Adminitración de la Aplicación</h1>
            </Grid>

            <Grid 
                xs={8}
                sx={{ width:'140vh', backgroundColor: '#262254', color:'white', mt:'20px', justifyContent: "center", display: "-ms-inline-grid", borderRadius: '10px',  boxShadow:'5px 5px 10px rgba(0, 0, 0, 0.5)'  }}
                alignItems="center"
                justifyContent="center"
                item>
                <Box  
                    alignItems="center"
                    justifyContent="center"
                    display="flex"
                 sx={{mt:"10px", mb:'10px', backgroundColor:'#262254'}}>
                    <Button  variant='contained'  color="secondary"  sx={{ width:'50vh'}}><NavLink style={{textDecoration: "none", color: "black",  fontWeight: 'bold'}}  to={`/admin/usuarios`}>Administrar Usuarios</NavLink></Button>
                </Box>
                <Box  
                    alignItems="center"
                    justifyContent="center"
                    display="flex"
                 sx={{mt:"10px", mb:'10px', backgroundColor:'#262254'}}>
                    <Button  variant='contained'  color="secondary"  sx={{ width:'50vh'}}><NavLink style={{textDecoration: "none", color: "black",  fontWeight: 'bold'}}  to={`/admin/bandas`}>Administrar Bandas</NavLink></Button>
                </Box>
            </Grid>
            
        </Grid>
    </>
  )
}
