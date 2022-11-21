import { NavbarInvitado } from "../../Components"
import { Grid, Typography, Button, Box, Divider } from '@mui/material';

export const Inicial = () => {
  return (
    <>
    <NavbarInvitado/>
    <Grid 
      container
      direction="column"
      alignItems="center"
      justifyContent="center"

      sx={{minHeight: '80vh', backgroundColor: 'white'}}
    >
      <Grid 
      container
      
  
      alignItems="center"
      justifyContent="center"
 
      sx={{minHeight: '73vh', backgroundColor: 'white', padding: 4 }}
      >
        <Grid 
        item
        lg={6}
        xs= { 12 }
        
  
        sx={{minHeight: '50vh', backgroundColor: 'white', padding: 4 }}
        >
          <Typography variant="h3" align="center">Gestión de bandas</Typography>
          <Typography align="center" sx={{mt:5}}>A través de Alcompás podrás gestionar todos los aspectos de tu banda procesional.</Typography>
          <Typography align="center" sx={{mt:5}}>Gestiona los músicos, eventos, faltas de asistencia, partituras y mucho más.</Typography>
          <Box textAlign='center' sx={{mt:13}}>
            <Button  variant='contained' align="center" href="/auth/login">Iniciar Sesión</Button>
          </Box>
        </Grid>
        <Divider flexItem />
        <Grid 
        item
        lg={6}
        xs= { 12 }
        sx={{minHeight: '50vh', backgroundColor: 'white', padding: 4 }}
        >
          <Typography variant="h3" align="center">Encuentra tu banda</Typography>
          <Typography align="center" sx={{mt:5}}>A través de Alcompás podrás encontrar a tus bandas favoritas así como consultar toda su información.</Typography>
          <Typography align="center" sx={{mt:5}}>Encuentra tus bandas favoritas consulta sus actuaciones, músicos, estadísticas y mucho más.</Typography>
          <Box textAlign='center' sx={{mt:13}}>
            <Button  variant='contained' align="center" href="/auth/register">Crear cuenta</Button>
          </Box>
        </Grid>
      

      </Grid>

      <Grid 
      container
      
  
      alignItems="center"
      justifyContent="center"
 
      sx={{minHeight: '187px', backgroundColor: 'primary.main' }}
      >
        <Grid 
        item
        lg={6}
        xs= { 12 }
        
  
        sx={{ backgroundColor: 'primary.main', padding: 4 }}
        >
          <Typography variant="h5" align="center" color={'white'}>Aplicación creada por Álvaro Úbeda Ruiz</Typography>
          <Typography variant="h6" align="center" color={'white'} sx={{mt:1}}>Todos los derechos reservados</Typography>
        </Grid>
        <Divider flexItem />
        <Grid 
        item
        lg={6}
        xs= { 12 }
        sx={{ backgroundColor: 'primary.main', padding: 4 }}
        >
          <Typography variant="h5" align="center" color={'white'}>Contacta con Alcompás</Typography>
          <Box textAlign='center' sx={{mt:1}}>
            <Button sx={{backgroundColor:'white', color:'primary.main'}}  size="small"variant='contained' align="center" href="https://www.facebook.com/profile.php?id=100010164360323">
            <img
                src='/../../Resources/Imagenes/facebook.png'
                alt='logo'
                loading="lazy"
            />
            </Button>
            <Button sx={{backgroundColor:'white', color:'primary.main', ml:1}}  size="small"variant='contained' align="center" href="https://mobile.twitter.com/alvaro_ubeda8">
              <img
                  src='/../../Resources/Imagenes/twitter.png'
                  alt='logo'
                  loading="lazy"
              />
            </Button>
            <Button sx={{backgroundColor:'white', color:'primary.main', ml:1}}  size="small"variant='contained' align="center" href="https://www.instagram.com/alvaro_ubeda8/">
              <img
                  src='/../../Resources/Imagenes/instagram.png'
                  alt='logo'
                  loading="lazy"
              />
            </Button>
            <Button sx={{backgroundColor:'white', color:'primary.main', ml:1}}  href="mailto:alvaroubeda8@gmail.com" size="small"variant='contained' align="center" >
              <img
                  src='/../../Resources/Imagenes/email.png'
                  alt='logo'
                  loading="lazy"
              />
            </Button>
          </Box>
        </Grid>

      </Grid>
    </Grid>
    </>
    
  )
}
