import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../hooks/useAuthStore';

import { useComentariosStore } from '../../../hooks';
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

export const NuevoComentario  = ( { open, handleClose, setComentarios, setOpen }) => {

    const [values, setValues] = useState({titulo:'', texto: ''});

    const { crearComentario, errores } = useComentariosStore();

    const { bandaId } = useParams();

    const { user } = useAuthStore();


   
    const handleForm = async e => {
        e.preventDefault();
        let error = "";
        if(values.titulo.length > 25 || values.titulo.length < 1 ) error = error + " El título debe de contener entre 1 y 25 caracteres ";
        if(values.texto.length > 500 || values.titulo.length < 1 ) error = error + " <br>  El texto debe de contener entre 1 y 50 caracteres";

        if(error != "") {
          Swal.fire('Error al publicar comentario', error, 'error');
        }
        else {
  
          const c = await crearComentario( bandaId, values, user.uid, setComentarios );
          setComentarios( co => [...co, c]);
          setValues({titulo:'', texto: ''});
          setOpen(false);
        }
      }
    
      const handleChangeInput = input => e => {    
        values[input] =  e.target.value;
      }

      useEffect(() => {
        if(  errores !== '' && errores !== '200' ){
          Swal.fire('Error al crear comentario', errores, 'error');
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
                      Añadir comentario
                    </Typography>
                <Grid container>
                    <Grid item xs={ 12 } sx={{ mt: 2}}>
                    <Typography  sx={{ color:'white'}} >
                      Título
                    </Typography>
                    <TextField 
                        sx={{ input: { color: 'white' }}}
                        type="text"
                        placeholder="Título del comentario"
                        fullWidth
                        focused
                        style={{ border: '1px solid #e2e2e1', borderRadius:'5px'}}
                        onChange={handleChangeInput('titulo')}
                    />
                    </Grid>
                    <Grid item xs={ 12 } sx={{ mt: 2}}>
                    <Typography  sx={{ color:'white'}} >
                      Texto del comentario
                    </Typography>
                    <TextField 
                        sx={{ input: { color: 'white' }}}
                        inputProps={{ style: { color: 'white' } }}
                        type="text"
                        placeholder="Texto del comentario"
                        fullWidth
                        focused
                        style={{ border: '1px solid #e2e2e1', borderRadius:'5px'}}
                        onChange={handleChangeInput('texto')}
                        multiline
                        rows={10}
                    />
                    </Grid>
                </Grid>
                <Box  sx={{mt:2, display:'flex', alignContent:'center', justifyContent:'center'}} >
                      <Button aria-label='enviar' color='secondary' sx={{ backgroundColor:'white', color:'black'}} variant='contained' onClick={handleForm}>
                        Publicar comentario
                      </Button>
                </Box>
            </form>
          </Box>
        </Modal>
      </div>
  )
}
