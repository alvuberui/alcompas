import { Grid, Box, Button } from '@mui/material'
import React from 'react'
import { NavBar } from '../../../Components'
import {
    BrowserRouter as Router,
    Link,
    NavLink,
}  from "react-router-dom";
import { useParams } from 'react-router-dom';

export const PanelDirectivo = () => {
    const { bandaId } = useParams();
  return (
    <>
        <NavBar></NavBar>
        <Grid
            container
            justifyContent="center"
            alignItems="center" 
        >
            <Grid 
                xs = { 8 }
                sx={{ backgroundColor: '#262254', color:'white', mt:'20px', justifyContent: "center", display: "flex", borderRadius: '10px', boxShadow:'5px 5px 10px rgba(0, 0, 0, 0.5)'  }}
                item>
                <h1 >Panel Directivo</h1>
            </Grid>

            <Grid 
                
                sx={{ width:'140vh', backgroundColor: '#262254', color:'white', mt:'20px', justifyContent: "center", display: "flex", borderRadius: '10px',  boxShadow:'5px 5px 10px rgba(0, 0, 0, 0.5)'  }}
                direction="column"
                justifyContent="center"
                alignItems="center"  
                container>
                <Box textAlign='center' sx={{mt:"10px", width:'50vh'}}>
                    <Button  variant='contained' align="center" color="secondary" fullWidth ><NavLink style={{textDecoration: "none", color: "black",  fontWeight: 'bold'}}  to={`/banda/panel/`}>Administrar Préstamos</NavLink></Button>
                </Box>
                <Box textAlign='center' sx={{mt:"10px", minWidth:'50vh'}}>
                    <Button  variant='contained' align="center" color="secondary" fullWidth ><NavLink style={{textDecoration: "none", color: "black",  fontWeight: 'bold'}}  to={`/peticiones/banda/${bandaId}`}>Administrar Peticiones</NavLink></Button>
                </Box>
                <Box textAlign='center' sx={{mt:"10px", minWidth:'50vh'}}>
                    <Button  variant='contained' align="center" color="secondary" fullWidth ><NavLink style={{textDecoration: "none", color: "black",  fontWeight: 'bold'}}  to={`/banda/panel/`}>Administrar Economía</NavLink></Button>
                </Box>
                <Box textAlign='center' sx={{mt:"10px", minWidth:'50vh'}}>
                    <Button  variant='contained' align="center" color="secondary" fullWidth ><NavLink style={{textDecoration: "none", color: "black",  fontWeight: 'bold'}}  to={`/banda/panel/`}>Administrar Redes Sociales</NavLink></Button>
                </Box>
                <Box textAlign='center' sx={{mt:"10px", minWidth:'50vh'}}>
                    <Button  variant='contained' align="center" color="secondary" fullWidth ><NavLink style={{textDecoration: "none", color: "black",  fontWeight: 'bold'}}  to={`/banda/panel/`}>Administrar Eventos</NavLink></Button>
                </Box>
                <Box textAlign='center' sx={{mt:"10px", minWidth:'50vh'}}>
                    <Button  variant='contained' align="center" color="error" fullWidth ><NavLink style={{textDecoration: "none", color: "black",  fontWeight: 'bold'}}  to={`/banda/panel/`}>Abandonar Banda Como Directivo</NavLink></Button>
                </Box>
                <Box textAlign='center' sx={{mt:"10px", mb:"10px", minWidth:'50vh'}}>
                    <Button  variant='contained' align="center" color="error" fullWidth ><NavLink style={{textDecoration: "none", color: "black",  fontWeight: 'bold'}}  to={`/banda/panel/`}>Eliminar Banda</NavLink></Button>
                </Box>
                
            </Grid>
            
        </Grid>
    </>
  )
}
