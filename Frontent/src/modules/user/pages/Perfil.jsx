
import { Grid, Typography, Button, Box, Tabs, Tab } from '@mui/material';
import Avatar from '@material-ui/core/Avatar';
import * as React from 'react';
import { NavBar } from '../../../Components';
import { useAuthStore } from '../../../hooks/useAuthStore';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
export const Perfil = () => {

  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };



  const [user, setUser] = React.useState([]);

  const { getUserByiD } = useAuthStore();
  const { id } = useParams();

  useEffect(() => {
    const getUser = async () => {
      const userreq = await getUserByiD(id);
      setUser(userreq);  
    }
    getUser();
  }, []);
  
  return (
    <>
    <NavBar/>
    <Grid 
      container 
    >
      <Grid 
        item
        lg={3}
        xs= { 12 }
        sx={{minHeight: '50vh', padding: 4 }}
        >
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Avatar   style={{ height: '150px', width: '150px' }} alt="Remy Sharp" src="/static/images/avatar/1.jpg"  />
          </Grid>
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography sx={{ fontWeight: 'bold', mt:'10px' }} variant='h5'>{ user.nombre } {user.primer_apellido} {user.segundo_apellido}</Typography>
          </Grid>
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography sx={{ fontWeight: 'bold' }} variant='h5'>@{user.usuario}</Typography>
          </Grid>
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography variant='h6'>{user.localidad} ({user.provincia})</Typography>
          </Grid>
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography variant='h6'>{user.fecha_nacimiento}</Typography>
          </Grid>
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography sx={{textDecoration: 'underline',  fontWeight: 'bold', mt:'10px' }} variant='h5'>Contacto</Typography>

          </Grid>
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography  variant='h6'>{user.correo}</Typography> 
          </Grid>
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography  variant='h6'>{user.telefono}</Typography> 
          </Grid>

          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography sx={{textDecoration: 'underline',  fontWeight: 'bold', mt:'10px' }} variant='h5'>Descripción</Typography>

          </Grid>
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography  sx={{textAlign: 'center'}} variant='h6'>{user.descripcion}</Typography> 
          </Grid>

          <Box textAlign='center' sx={{mt:2}}>
            <Button  variant='contained' align="center" href="/auth/register">Editar datos</Button>
          </Box>
          <Box textAlign='center' sx={{mt:2}}>
            <Button  variant='contained' align="center" href="/auth/register">Eliminar cuenta</Button>
          </Box>
          
        </Grid>

        <Grid 
        item
        lg={9}
        xs= { 12 }
        sx = {{ mt: 5 }}
        display="flex"
        justifyContent="center"
        alignItems="baseline"
        >
          
            <Box  xs={12}   sx={{ width: '95%', color:'white',  backgroundColor:'#262254', borderRadius:'5px' }}
            >
              <Tabs value={value} onChange={handleChange} textColor='inherit' centered>
                <Tab label="Experiencias" />
                <Tab label="Instrumentos" />
                <Tab label="Estudios" />
              </Tabs>
            </Box>
            

          
        </Grid>

    </Grid>
    </>
  )
}
