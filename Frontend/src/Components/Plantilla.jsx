import { Grid, Typography } from '@mui/material';
import React from 'react';

import { Musico } from './Musico';

export const Plantilla = ( { musicos, usuarios, tipo, directivo, setComponente } ) => {

 

  const renderizar = () => {
    let html = [];
    
      if(tipo === "Músicos" ) {
        const keys = Object.keys(musicos);

        for(let i = 0; i < keys.length; i++){
          const key = keys[i];
          html.push(<Grid justifyContent="center" alignItems="center" key={key}  container><Typography   variant='h6' align='center' color='white'> {key} </Typography></Grid>);
          const listaUsuarios = usuarios[key]
          if( listaUsuarios ) {
            for(let j = 0; j < listaUsuarios.length; j++){
              const value = listaUsuarios[j];
              html.push(<Musico key={ (j+1) * (i+1) } usuario={value} tipo={"musico"} directivo={directivo} setComponentes={setComponente}/>);
            }
          }
        }
      }
      else if(tipo === "Directivos") {
        
        const keys = Object.keys(musicos);
       
        for(let i = 0; i < keys.length; i++){
          const key = keys[i];
          html.push(<Grid justifyContent="center" alignItems="center" key={key}  container><Typography   variant='h6' align='center' color='white'> {key} </Typography></Grid>);
          const listaUsuarios = usuarios[key]
          if( listaUsuarios ) {
            for(let j = 0; j < listaUsuarios.length; j++){
              const value = listaUsuarios[j];
              html.push(<Musico key={ (j+1) * (i+1) }  usuario={value} tipo={"directivo"} directivo={directivo} setComponentes={setComponente}/>); 
            }
          }
        }
      } else {
        const keys = Object.keys(musicos);
       
        for(let i = 0; i < keys.length; i++){
          const key = keys[i];
          html.push(<Grid justifyContent="center" alignItems="center" key={key}  container><Typography   variant='h6' align='center' color='white'> {key} </Typography></Grid>);
          const listaUsuarios = usuarios[key]
          if( listaUsuarios ) {
            for(let j = 0; j < listaUsuarios.length; j++){
              const value = listaUsuarios[j];
              html.push(<Musico key={ (j+1) * (i+1) }  usuario={value} tipo={"archivero"} directivo={directivo} setComponentes={setComponente}/>); 
            }
          }
        }
      }
      return html;
  }
      

  return (
    <Grid
    container
    sx={{ backgroundColor:'#262254', mt:'10px', borderRadius: '5px', width:'98%'}}
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
          <Typography variant='h3' align='center' color='white'> {tipo} </Typography>
        </Grid>
          <Grid
            container
            spacing={1}
            
          >
            {
              Object.keys(musicos).length === 0 &&
              <Grid item xs={12} lg={12} alignContent={'center'} justifyContent={'center'}>
                <Typography sx={{ml:'10px', mt:'10px', textAlign:'center'}} color='white'>No existe ninguno en la banda</Typography>
              </Grid>
            }
            {  Object.keys(musicos).length > 0 &&
              renderizar().map( (item, key) => {
                return item;
              })
            }
          </Grid>
      </Grid>
    </Grid>
    
  )
}
