import { useEffect, useState } from 'react'
import { useAnunciosStore } from '../../hooks';
import { FixedSizeList } from 'react-window';
import { Grid, Box, List   } from '@material-ui/core';
import { Noticia } from '../../Components/Noticia';
import { Typography } from '@mui/material';
import { Calendario } from '../../Components/Calendario';

export const Dashboard = () => {

  // Estados
  const [noticias, setNoticias] = useState([]);

  // Hooks
  const { getAllPublicas } = useAnunciosStore();

  useEffect(() => {
    const getAnuncios = async () => {
      const userreq = await getAllPublicas();
      setNoticias(userreq.reverse());
    }
    getAnuncios();
  }, []);
  
  return (
    <>
      <Grid 
        container
        direction="row"
        
      >
        <Grid 
        item lg={6} xs={12}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            xs={12}
            sx={{ mt:10, mb:5 }}
          >
            <Typography variant="h4"  component="div" sx={{textAlign:'center', mt:5, mb:5}}>Noticias Destacadas</Typography>
          </Box>
          <List
            sx={{
              width: '100%',
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'auto',
              '& ul': { padding: 0 },
            }}
          >
            { noticias.length > 0 ?
              noticias.map((noticia, index) => (
              <Noticia noticia={noticia} index={index} key={index} setNoticias={setNoticias}/>
              ))
              :
              <>
                <Typography variant="h6"  component="div" sx={{textAlign:'center', mt:5, mb:5}}>No hay noticias destacadas...</Typography>
                <Typography variant="h6"  component="div" sx={{textAlign:'center', mt:5, mb:5}}>Vuelve en otro momento.</Typography>
              </>
          }
          </List>
        </Grid>
        <Grid item lg={6} xs={12} >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper', mt:'10px' }}
        >
          <Typography variant="h4"  component="div" sx={{textAlign:'center', mt:5, mb:5}}>Eventos Destacados</Typography>
          <Calendario tipo={"dashboard"}/>
        </Box>
        
        </Grid>
      </Grid>
    </>
  )
}
