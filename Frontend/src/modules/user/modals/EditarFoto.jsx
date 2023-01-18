import { Box, Button, Grid, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../hooks/useAuthStore';
import { useUploadsStore } from '../../../hooks/useUploadsStore';

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

export const EditarFoto = ( { open, handleClose, setOpen, tipo } ) => {

    const { user } = useAuthStore();
    const { bandaId } = useParams();
    const  [ img, setImg ] = React.useState('');
    const [ nombre, setNombre ] = useState('');
    const { errores, setErrores, editarFotoUsuario, editarFotoBanda } = useUploadsStore();

    const handleChangeInput = input => e => {    
      setImg(e.target.files[0]);
      setNombre(e.target.value);
    }

    const handleForm = async e => {
      e.preventDefault();
      
      if( img === '' ) {
        Swal.fire('Debe de seleccionar una foto', 'Debe de seleccionar una foto', 'error');
      }
      else {
        const u = await editarFotoUsuario( img, user.uid );
        setOpen(false);
        setNombre('');
      }
    }

    const handleFormBanda = async e => {
      e.preventDefault();
      
      if( img === '' ) {
        Swal.fire('Debe de seleccionar una foto', 'Debe de seleccionar una foto', 'error');
      }
      else {
        await editarFotoBanda( img, bandaId );
        setOpen(false);
        setNombre('');
      }
    }

    useEffect(() => {
      if(  errores.length > 0 ) {
        let error ='';
        for(let i = 0; i < errores.length; i++) {
          error = error + '<br>' + errores[i];
        }
        Swal.fire('Error al editar foto', error, 'error');
        setErrores([]);
        setNombre('');
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
                      AÑADIR FOTO
                    </Typography>
                <Grid container>
                    <Grid item xs={ 12} sx={{mt:'10px'}} >
                    <Typography  sx={{ color:'white'}} >
                      Seleccione la foto:
                    </Typography>
                    </Grid>
                    <Grid item xs={ 12 } sx={{mt:'10px'}}>
                    <input
                      type="file"
                      style={{ color: "white" }}
                      onChange={handleChangeInput('img')}
                      value={ nombre }
                    />
                    </Grid>
                </Grid>
                <Box  sx={{mt:2, display:'flex', alignContent:'center', justifyContent:'center'}} >
                    { tipo === 'usuario' ?
                      <Button color='secondary' sx={{ backgroundColor:'white', color:'black'}} variant='contained' onClick={handleForm}>
                        Añadir foto
                      </Button>
                      :
                      tipo === 'banda' ?
                      <Button color='secondary' sx={{ backgroundColor:'white', color:'black'}} variant='contained' onClick={handleFormBanda}>
                        Añadir foto
                      </Button>
                      :
                      <Button color='secondary' sx={{ backgroundColor:'white', color:'black'}} variant='contained' onClick={handleForm}>
                        Añadir foto
                      </Button>
                    }

                </Box>
            </form>
          </Box>
        </Modal>
      </div>
  )
}
