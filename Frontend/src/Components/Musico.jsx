
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid, Paper, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import {
  useNavigate,
  NavLink, useParams
} from "react-router-dom";
import { useDirectivosStore } from '../hooks/useDirectivosStore';
import { useMusicosStore } from '../hooks/useMusicosStore';

export const Musico = ({usuario, tipo, directivo}) => {

  const { bandaId } = useParams();
  const { finalizarMusico } = useMusicosStore();
  const { finalizarDirectivo, getDirectivosByBandaId } = useDirectivosStore();
  const navigate = useNavigate();

  const handleEliminarMusico = (e) => {
    e.preventDefault();
    finalizarMusico(usuario._id, bandaId);
  }

  const handleEliminarDirectivo = async(e) => {
    e.preventDefault();
    const directivos = await getDirectivosByBandaId(bandaId);
    const keys = Object.keys(directivos);
    let contador = 0;
    for( const key of keys) {
      contador += directivos[key].length;
    }
    if(contador === 1){
      navigate('/');
      finalizarDirectivo(usuario._id, bandaId);
    }
    else {
      finalizarDirectivo(usuario._id, bandaId);
    }
      
  
    
  }

  return (
      <Grid
      xs={4}
      item>
        <NavLink style={{textDecoration: "none", color: "black"}}  to={`/perfil/${usuario._id}`}>
          <Paper elevation={ 3 }   sx={{ vh:'100vh', mb:'10px'}}>
            <Grid container>
              <Grid item xs={12} lg={11} alignContent={'center'} justifyContent={'center'}>
                <Typography sx={{ml:'10px', mt:'10px', textAlign:'center'}}>{usuario.nombre } { usuario.primer_apellido} { usuario.segundo_apellido }</Typography>
              </Grid>
              { directivo && 
                <Grid item xs={12} lg={1} alignContent={'center'} justifyContent={'center'} display='flex'>
                  { tipo === 'musico' ?
                    <IconButton onClick={ handleEliminarMusico } sx = {{alignSelf:'flex-end'}} color="error" aria-label="upload picture" component="label">
                      <DeleteIcon  ></DeleteIcon>
                    </IconButton>
                    :
                    <IconButton onClick={ handleEliminarDirectivo  } sx = {{alignSelf:'flex-end'}} color="error" aria-label="upload picture" component="label">
                      <DeleteIcon  ></DeleteIcon>
                    </IconButton>
                  }
                </Grid>
        }
            </Grid>
          </Paper>
        </NavLink>
      </Grid>
  )
}
