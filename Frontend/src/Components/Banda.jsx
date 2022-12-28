
import { Grid, Typography, Button, Box } from '@mui/material';
import { useBandasStore, useDirectivosStore, useAuthStore, usePeticionesStore } from '../hooks';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import {
    BrowserRouter as Router,
    Link,
    NavLink,
}  from "react-router-dom";

export const Banda = ({ _id, nombre, tipo }) => {
    
  return (
        <Grid 
        item
        xs= { 10 }
        sx={{ mt:'15px', maxWidth:'125vh', padding:2, backgroundColor:'white', borderRadius:'5px', border:1, borderColor: 'white', boxShadow:' 1px 1px 1px 1px' }}
        >   
            <NavLink style={{textDecoration: "none", color: "black"}}  to={`/banda/${_id}`}>
            <Grid
            container
            display="flex"
            justifyContent="center"
            alignItems="center">
                <Grid
                item
                xs= { 1.5 }
                >
                    <Avatar sx={{width:'80px', height:'80px'}} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDsbH-wextgQ3BwgF5gWCU7DptFzzA-4veD7V6_vi8ug&s" />
                </Grid>
                <Grid
                item
           
                xs= { 10 }
                >
                    <Typography variant='h6' sx={{fontWeight: 'bold', textAlign:'left', color:'black', paddingLeft:'40px'}}>{tipo} {nombre}</Typography>
                </Grid>
                
                
            </Grid>
            </NavLink>
        </Grid>
    );
}
