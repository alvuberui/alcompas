import Avatar from '@material-ui/core/Avatar';
import { Box, Button, Grid, Typography, Select, MenuItem} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import { useMusicosStore } from '../../../hooks/useMusicosStore';
import { Contratado } from '../../../Components';
import { useAuthStore, useDirectivosStore, useEventosStore } from '../../../hooks';

const nombres = ['Corneta', 'Tambor', 'Bordonera', 'Caja', 'Bombo', 'Platos',
                            'Percusionista', 'Tuba', 'Trombón', 'Bombardino', 'Trompa',
                            'Fliscorno', 'Trompeta', 'Saxofón Alto', 'Saxofón Tenor', 
                            'Saxofón Barítono', 'Clarinete', 'Flauta', 'Flautín', 'Oboe',
                            'Fagot', 'Lira', 'Campana', 'Cascabeles', 'Batería', 'Xilófono',
                            'Timbales', 'Campanilla', 'Clarinete Bajo', 'Requinto'];

export const ContratarMusico = () => {
    const [ values, setValues ] = useState({ instrumento: 'Corneta', localidad:'' });
    const [ musicos, setMusicos ] = useState([]);
    const [ esDirectivo, setEsDirectivo ] = useState('a');

    const { eventoId, tipoEvento } = useParams();

    const handleChangeInput = input => e => { 
        const { value } = e.target;
        setValues({ ...values, [input]: value });
    }

    const { getMusicosByIntrumentoAndLocalidad } = useMusicosStore();
    const { getByTipoId } = useEventosStore();
    const { getDirectivoByUserId } = useDirectivosStore();
    const { user } = useAuthStore();

    const handleClickBuscar = async() => {
        const musicosReq = await getMusicosByIntrumentoAndLocalidad(values.instrumento, values.localidad);
        setMusicos(musicosReq);
    }

    useEffect(() => {
        const getPermisos = async () => {
            const evento = await getByTipoId(tipoEvento, eventoId);
            if( evento ) {
                const directivos = await getDirectivoByUserId(user.uid);
                if( directivos.length === 0) setEsDirectivo(false);
                for( let i = 0; i < directivos.length; i++ ){
                    const directivo = directivos[i];
                    if( directivo.banda === evento.banda && !directivo.fechaFin){
                        setEsDirectivo(true);
                    break;
                    } else {
                        setEsDirectivo(false);
                    }
                }
            }
      }
      getPermisos();
      }, [eventoId, tipoEvento]);

      if( esDirectivo === 'a' ) return (
        <Box sx={{ display: 'flex', justifyContent:"center", alignItems:"center"}}>
            <CircularProgress  size={300}/>
        </Box> )
      else {

  return (
    <Grid container justifyContent="center" alignItems="center" >
        { !esDirectivo && <Navigate to="/" />}
                <Grid 
                lg = {9}
                xs = { 11 }
                sx={{ backgroundColor: '#262254', color:'white', mt:'20px', justifyContent: "center", display: "flex", borderRadius: '5px', boxShadow:'0 1px 3px rgba(0, 0, 0, 0.12)'  }}
                item>
                <h1 style={{textAlign:'center'}} aria-label='h3'>Administración de Usuarios</h1>
                </Grid>

                <Grid 
                lg = {9}
                xs = { 11 }
                sx={{ backgroundColor: 'white', mt:'20px', borderRadius: '5px', boxShadow:'0 1px 3px rgba(0, 0, 0, 0.24)'  }}
              
                item>
                    <Grid 
                    xs = { 12 }
                    sx={{ backgroundColor: 'white', mt:'20px', justifyContent: "center", display: "flex"  }}
                    item>
                        <Typography variant='h5'  >Buscar músico:</Typography>
                    </Grid>
                    <Grid 
                    xs = { 12 }
                    sx={{ backgroundColor: 'white', mt:'20px', justifyContent: "center", display: "flex"  }}
        
                    item>
                        <Typography  variant='h6' >Instrumento:</Typography>
                    </Grid>
                    <Grid 
                    xs = { 12 }
                    sx={{ backgroundColor: 'white', mt:'20px', justifyContent: "center", display: "flex"  }}
        
                    item>
                        <Select
                        style={{  border: '1px solid #e2e2e1' }}
                        sx={{ width:'50%'}} 
                        id="demo-simple-select"
                        value={ values.instrumento }
                        fullWidth
                        onChange={handleChangeInput('instrumento')}
                        >
                        { nombres.map( (tipo, index) => (
                          <MenuItem key={index} value={tipo}>{tipo}</MenuItem>
                          )) }
                        </Select>
                    </Grid>
                    <Grid 
                    xs = { 12 }
                    sx={{ backgroundColor: 'white', mt:'20px', justifyContent: "center", display: "flex"  }}
        
                    item>
                        <Typography  variant='h6' >Localidad:</Typography>
                    </Grid>
                    <Grid 
                    xs = { 12 }
                    sx={{ backgroundColor: 'white', mt:'20px', justifyContent: "center", display: "flex"  }}
        
                    item>
                        <TextField 
                            style={{ border: '1px solid #e2e2e1', borderRadius:'5px'}}
                            sx={{ width:'50%'}} 
                            type="text"
                            placeholder="Escriba aquí la localidad" 
                            fullWidth
                            onChange={handleChangeInput('localidad')}
                            defaultValue={values.localidad}
                        />
                    </Grid>
                    <Grid 
                    xs = { 12 }
                    sx={{ backgroundColor: 'white', mt:'20px', justifyContent: "center", display: "flex"  }}
        
                    item>
                        <Button variant="contained" sx={{ mt:'20px', mb:'20px', width:'50%', backgroundColor:'#262254', color:'white' }} onClick={handleClickBuscar}>Buscar</Button>
                    </Grid>
                </Grid>
                <Grid 
                lg = {9}
                xs = { 11 }
                
              
                item>
                    {musicos.map( (musico, index) => (
                        <Contratado key={index} musico={musico} />
                    ))}
                </Grid>
            </Grid>
  )}
}
