import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEventosStore } from '../../../hooks';
import { Box, CircularProgress, Grid, Typography} from '@mui/material';
import { Evento } from '../../../Components/Evento';
import { useAsistenciasStore } from '../../../hooks/useAsistenciasStore';
import { Plantilla } from '../../../Components';
import { Musico } from '../../../Components/Musico';

export const AsistenciaEvento = () => {

    const [ evento, setEvento ] = useState();
    const [ asistencias, setAsistencias ] = useState();
    const [ isLoading, setIsLoading ] = useState(true);

    const { eventoId } = useParams();
    const { tipoEvento } = useParams();

    const {  getByTipoId } = useEventosStore();
    const { getTodasAsistenciasByEvento } = useAsistenciasStore();

    useEffect(() => {
        const getEvento = async () => {
            const evento = await getByTipoId(tipoEvento, eventoId);
            setEvento(evento);
        }
        const getAsistencias = async () => {
            const asistencias = await getTodasAsistenciasByEvento(eventoId,  tipoEvento === 'Actuación' ? 'Actuacion' : tipoEvento === 'Procesión' ? 'Procesion' : 'Ensayo');
            setAsistencias(asistencias);
        }
        getEvento();
        getAsistencias();
    }, [tipoEvento, eventoId]);
   

    useEffect(() => {
      const checkLoading = () => {
        if( evento != undefined && asistencias != undefined && tipoEvento != undefined ){
          setIsLoading(false);
        } else {
          setIsLoading(true);
        }
      }
      checkLoading();
    }, [evento, tipoEvento, asistencias]);

    const renderizar = () => {
      let html = [];
      
      const keys = Object.keys(asistencias);
  
      for(let i = 0; i < keys.length; i++){
            const key = keys[i];
            html.push(<Grid justifyContent="center" alignItems="center" key={key}  container><Typography  sx={{mt:2}} variant='h6' align='center' color='white'> {key} </Typography></Grid>);
            const lista = asistencias[key]
            if( lista ) {
              for(let j = 0; j < lista.length; j++){
                const value = lista[j];
                html.push(<Musico key={ (j+1) * (i+1) } usuario={value[0]} tipo={"Directivo"} asistencia={value[1]} />);
              }
            }
          }
          return html;
        }

    
  if( isLoading ) {
    return (
    <Box sx={{ display: 'flex', justifyContent:"center", alignItems:"center"}}>
        <CircularProgress  size={300}/>
    </Box> )
  }
  else {
    return (
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
            lg={10}
            xs= { 12 }
            sx={{ padding:2, backgroundColor:'primary.main', borderRadius:'5px', boxShadow:' 1px 1px 1px 1px' }}
            >
              <Typography  variant='h4' sx={{textAlign:'center', color:'white'}}>{tipoEvento + ': ' + evento.titulo } </Typography>
          </Grid>
            <Grid
              container
              sx={{ backgroundColor:'#262254', mt:'10px', borderRadius: '5px'}}
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
                      spacing={1}
                      
                    >
                      { renderizar().map( (item, key) => {
                          return item;
                        })
                      }
                    </Grid>
                </Grid>
              </Grid>
        </Grid>
      </Grid>
    )
  }
}
