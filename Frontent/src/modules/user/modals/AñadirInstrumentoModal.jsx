import { Grid, Typography, Button, Checkbox, FormControlLabel, Box, Tabs, Tab } from '@mui/material';
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
import { useInstrumentosStore } from '../../../hooks/useInstrumentosStore';
import { validarInstrumentos } from '../../../helpers/validarInstrumento';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50vh',
    bgcolor: '#262254',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
    display:'flex',
    alignContent:'center',
    justifyContent:'center'
};

export const AñadirInstrumentoModal  = ( { open, handleClose, setInstrumentos, setOpen }) => {

    const [instrumento, setInstrumento] = useState({instrumento:'', marca: '', modelo: '', numeroSerie: ''});
    const [ isCreado, setIsCreado ] = useState(false);

    const { crearInstrumentoUsuario, errores, setErrores } = useInstrumentosStore();
    const { user } = useAuthStore();


   
    const handleForm = async e => {
        e.preventDefault();
        let error = "";
        if(validarInstrumentos(instrumento.instrumento) === false) error = error + " El instrumento no es válido ";
        if(instrumento.modelo.length > 50 ) error = error + " <br>  El modelo no puede contener más de 50 caracteres ";
        if(instrumento.marca.length > 50 ) error = error + " <br>  La marca no puede contener más de 50 caracteres ";
        if(instrumento.numeroSerie.length > 50 ) error = error + " <br>  El número de serie no puede contener más de 50 caracteres ";

        if(error != "") {
          Swal.fire('Error al publicar comentario', error, 'error');
        }
        else {
  
          const c = await crearInstrumentoUsuario( instrumento, user.uid );
          setInstrumentos( co => [...co, c]);
          setInstrumento({instrumento:'', marca: '', modelo: '', numeroSerie: ''});
          setOpen(false);
        }
      }
    
      const handleChangeInput = input => e => {    
        instrumento[input] =  e.target.value;
      }

      useEffect(() => {
        if(  errores.length > 0 ) {
          let error ='';
          for(let i = 0; i < errores.length; i++) {
            error = error + '<br>' + errores[i];
          }
          Swal.fire('Error al crear comentario', error, 'error');
          setErrores([]);
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
          <Box sx={style}>
          
            <form>
                <Typography  variant='h4' sx={{ textAlign:'center' ,color:'white'}} >
                      Añadir Instrumento
                    </Typography>
                <Grid container>
                    <Grid item xs={ 12 } sx={{ mt: 2}}>
                    <Typography  sx={{ color:'white'}} >
                      Instrumento
                    </Typography>
                    <TextField 
                        sx={{ input: { color: 'white' }}}
                        type="text"
                        placeholder="Instrumento"
                        fullWidth
                        focused
                        style={{ border: '1px solid #e2e2e1', borderRadius:'5px'}}
                        onChange={handleChangeInput('instrumento')}
                    />
                    </Grid>
                    <Grid item xs={ 12 } sx={{ mt: 2}}>
                    <Typography  sx={{ color:'white'}} >
                      Marca
                    </Typography>
                    <TextField 
                        sx={{ input: { color: 'white' }}}
                        inputProps={{ style: { color: 'white' } }}
                        type="text"
                        placeholder="Marca"
                        fullWidth
                        focused
                        style={{ border: '1px solid #e2e2e1', borderRadius:'5px'}}
                        onChange={handleChangeInput('marca')}
                        
                    />
                    <Typography  sx={{ color:'white', mt: 2}} >
                      Modelo
                    </Typography>
                    <TextField 
                        sx={{ input: { color: 'white' }}}
                        inputProps={{ style: { color: 'white' } }}
                        type="text"
                        placeholder="Modelo"
                        fullWidth
                        focused
                        style={{ border: '1px solid #e2e2e1', borderRadius:'5px'}}
                        onChange={handleChangeInput('modelo')}
                        
                    />
                    <Typography  sx={{ color:'white', mt: 2}} >
                      Número de serie
                    </Typography>
                    <TextField 
                        sx={{ input: { color: 'white' }}}
                        inputProps={{ style: { color: 'white' } }}
                        type="text"
                        placeholder="Número de serie"
                        fullWidth
                        focused
                        style={{ border: '1px solid #e2e2e1', borderRadius:'5px'}}
                        onChange={handleChangeInput('numeroSerie')}
                    />
                    </Grid>
                </Grid>
                <Box  sx={{mt:2, display:'flex', alignContent:'center', justifyContent:'center'}} >
                      <Button color='secondary' sx={{ backgroundColor:'white', color:'black'}} variant='contained' onClick={handleForm}>
                        Crear instrumento
                      </Button>
                </Box>
            </form>
          </Box>
        </Modal>
      </div>
  )
}
