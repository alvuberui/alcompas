import { Grid, Typography, Button, Checkbox,Select, MenuItem, FormControlLabel, Box, Tabs, Tab } from '@mui/material';
import Avatar from '@material-ui/core/Avatar';
import * as React from 'react';
import { NavBar } from '../../../Components';
import { useAuthStore } from '../../../hooks/useAuthStore';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import {  TextField } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';
import Swal from 'sweetalert2';

import {
  BrowserRouter as Router,
  Link,
  NavLink,
}  from "react-router-dom";
import { useComentariosStore } from '../../../hooks';
import { useNavigate } from 'react-router-dom';
import { PerfilBanda } from '../pages/PerfilBanda';
import { useRedesSocialesStore } from '../../../hooks/useRedesSocialesStore';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vh',
    bgcolor: '#262254',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
    display:'flex',
    alignContent:'center',
    justifyContent:'center'
};

export const NuevasRedSocial = ({ open, handleClose, setRedes, setOpen }) => {

    const [values, setValues] = useState({nombre:'', url: '', select:'Instagram'});
    const { crearRedSocial, errores, setErrores } = useRedesSocialesStore();
    const { bandaId } = useParams();
    const [ nombre, setNombre ] = useState('');


   
    const handleForm = async e => {
        e.preventDefault();
        let error = "";
        
        if(values.nombre.length > 150  ) error = error + " El nombre debe de contener menos de 150 caracteres";
        if(values.url.length > 2000 || values.url.length < 1 ) error = error + " <br>  La url debe de contener entre 1 y 2000 caracteres";

        if(error != "") {
          Swal.fire('Error al añadir red social', error, 'error');
        }
        else {
          let dic = { url: values.url };
          if(values.select === 'Otro') dic['nombre'] = values.nombre;
          else dic['nombre'] = values.select;
          const c = await crearRedSocial( bandaId, dic );
          setRedes( co => [...co, c]);
          setValues({nombre:'', url: '', select:'Instagram'});
          setOpen(false);
        }
      }
    
    
      const handleChangeInput = input => e => {    
        values[input] = e.target.value;
        if(input === 'select') setNombre(e.target.value);
      }

      useEffect(() => {
        if(  errores !== '' && errores !== '200' ){
          Swal.fire('Error al añadir red social', errores, 'error');
        }
      }, [errores])
     
  return (
    <div>
       
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          id="cambiar-contraseña"
        >
          <Box sx={style} >
          
            <form>
                <Typography  variant='h4' sx={{ textAlign:'center' ,color:'white'}} >
                      Añadir Red Social
                    </Typography>
                <Grid container>
                <Grid item xs={ 12 } sx={{ mt: 2}}>
                    <Typography  sx={{ color:'white'}} >
                      Nombre de la red social
                    </Typography>
                    <Select
                      style={{ color: 'white', border: '1px solid #e2e2e1' }}
                      inputProps={{ style: { color: 'white' } }} 
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Age"
                      value={ values.select }
                      fullWidth
                      onChange={handleChangeInput('select')}
                    >
                      <MenuItem key={'Instagram'} value={'Instagram'}>Instagram</MenuItem>
                      <MenuItem key={'Twitter'} value={'Twitter'}>Twitter</MenuItem>
                      <MenuItem key={'Facebook'} value={'Facebook'}>Facebook</MenuItem>
                      <MenuItem key={'Youtube'} value={'Youtube'}>Youtube</MenuItem>
                      <MenuItem key={'TikTok'} value={'TikTok'}>TikTok</MenuItem>
                      <MenuItem key={'Spotify'} value={'Spotify'}>Spotify</MenuItem>
                      <MenuItem key={'SoundCloud'} value={'SoundCloud'}>SoundCloud</MenuItem>
                      <MenuItem key={'Email'} value={'Email'}>Email</MenuItem>
                      <MenuItem key={'Apple Music'} value={'Apple Music'}>Apple Music</MenuItem>
                      <MenuItem key={'Otro'} value={'Otro'}>Otro</MenuItem>
                    </Select>
                    </Grid>
                    { values.select === 'Otro' &&
                      <Grid item xs={ 12 } sx={{ mt: 2}}>
                      <Typography  sx={{ color:'white'}} >
                        Escribe el nombre
                      </Typography>
                      <TextField 
                          sx={{ input: { color: 'white' }}}
                          type="text"
                          placeholder="Nombre"
                          fullWidth
                          focused
                          style={{ border: '1px solid #e2e2e1', borderRadius:'5px'}}
                          onChange={handleChangeInput('nombre')}
                      />
                      </Grid>
                    }
                    <Grid item xs={ 12 } sx={{ mt: 2}}>
                    <Typography  sx={{ color:'white'}} >
                      Url de la red social
                    </Typography>
                    <TextField 
                        sx={{ input: { color: 'white' }}}
                        inputProps={{ style: { color: 'white' } }}
                        type="text"
                        placeholder="URL"
                        fullWidth
                        focused
                        style={{ border: '1px solid #e2e2e1', borderRadius:'5px'}}
                        onChange={handleChangeInput('url')}
                        multiline
                        rows={2}
                    />
                    </Grid>
                </Grid>
                <Box  sx={{mt:2, display:'flex', alignContent:'center', justifyContent:'center'}} >
                      <Button color='secondary' sx={{ backgroundColor:'white', color:'black'}} variant='contained' onClick={handleForm}>
                        Añadir red social
                      </Button>
                </Box>
            </form>
          </Box>
        </Modal>
      </div>
  )
}
