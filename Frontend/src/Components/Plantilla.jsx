import { Grid, Typography } from '@mui/material';
import React from 'react';
import { useAuthStore } from '../hooks/useAuthStore';
import { Musico } from './Musico';

export const Plantilla = ( { musicos, usuarios } ) => {

  const { getUserByiD } = useAuthStore();

  const renderizar = () => {
    let html = [];
      const keys = Object.keys(musicos);

      for(let i = 0; i < keys.length; i++){
        const key = keys[i];
        html.push(<Grid justifyContent="center" alignItems="center" key={key}  container><Typography   variant='h6' align='center' color='white'> {key} </Typography></Grid>);
        const lista = [];
        const listaUsuarios = usuarios[key]
        if(listaUsuarios === undefined) continue;
        for(let j = 0; j < listaUsuarios.length; j++){
          const value = listaUsuarios[j];
          if(lista.includes(value)) {
            html.push(<Musico key={ (j+1) * (i+1) } musico={value} usuario={value} tipo={"musico"} />);
          } else {
            html.push(<Musico key={ (j+1) * (i+1) } musico={value} usuario={value} tipo={"directivo"}/>);
          }
          
        }
      }
      return html;
  }
      

  return (
    <Grid
    container
    sx={{ backgroundColor:'#262254', borderRadius: '5px'}}
    justifyContent="center"
      alignItems="center" >
      <Grid
      item
      xs={11}
      justifyContent="center"
      alignItems="center" 
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center" 
        >
          <Typography variant='h3' align='center' color='white'> Plantilla </Typography>
        </Grid>
        <Grid
          container
          spacing={1}
          
        >
          { renderizar().map( (item, key) => {
              return item;
            })
          }
        </Grid>
      </Grid>
    </Grid>
    
  )
}
