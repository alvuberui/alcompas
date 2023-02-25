import { Box, Button, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../hooks/useAuthStore';

import { validarInstrumentos } from '../../../helpers/validarInstrumento';
import { useInstrumentosStore } from '../../../hooks/useInstrumentosStore';

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
const nombres = ['Corneta', 'Tambor', 'Bordonera', 'Caja', 'Bombo', 'Platos',
                            'Percusionista', 'Tuba', 'Trombón', 'Bombardino', 'Trompa',
                            'Fliscorno', 'Trompeta', 'Saxofón Alto', 'Saxofón Tenor', 
                            'Saxofón Barítono', 'Clarinete', 'Flauta', 'Flautín', 'Oboe',
                            'Fagot', 'Lira', 'Campana', 'Cascabeles', 'Batería', 'Xilófono',
                            'Timbales', 'Campanilla', 'Clarinete Bajo', 'Requinto'];

export const AñadirInstrumentoModal  = ( { open, handleClose, setInstrumentos, setOpen, editar, instrumentoId }) => {
    
    // Estados
    const [instrumento, setInstrumento] = useState({instrumento:'Corneta', marca: '', modelo: '', numeroSerie: ''});

    // Funciones
    const { crearInstrumentoUsuario, errores, setErrores, getInstrumentosById,
      editarInstrumentoUsuario } = useInstrumentosStore();
    const { user } = useAuthStore();

    const validarInstrumento =  () => {
      let error = "";
      if(validarInstrumentos(instrumento.instrumento) === false) error = error + " El instrumento no es válido ";
      if(instrumento.modelo.length > 50 ) error = error + " <br>  El modelo no puede contener más de 50 caracteres ";
      if(instrumento.marca.length > 50 ) error = error + " <br>  La marca no puede contener más de 50 caracteres ";
      if(instrumento.numeroSerie.length > 50 ) error = error + " <br>  El número de serie no puede contener más de 50 caracteres ";

      return error;
    }

    const handleFormEditar = async e => {
      e.preventDefault();
      let error = validarInstrumento();
      if(error != "") {
        Swal.fire('Error al editar instrumento', error, 'error');
      }
      else {

        const c = await editarInstrumentoUsuario( instrumento, user.uid, instrumentoId );
        setInstrumentos( co => [...co, c].filter( i => i._id !== instrumentoId) );
        setInstrumentos( co => [...co, c]);
        setInstrumento({instrumento:'Corneta', marca: '', modelo: '', numeroSerie: ''});
        setOpen(false);
      }
    }
   
    const handleForm = async e => {
        e.preventDefault();
        let error = validarInstrumento();

        if(error != "") {
          Swal.fire('Error al publicar instrumento', error, 'error');
        }
        else {
  
          const c = await crearInstrumentoUsuario( instrumento, user.uid );
          setInstrumentos( co => [...co, c]);
          setInstrumento({instrumento:'Corneta', marca: '', modelo: '', numeroSerie: ''});
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
          Swal.fire('Error al crear instrumento', error, 'error');
          setErrores([]);
        }
        
      }, [errores])

      useEffect(() => {
        const getInstrumento = async () => {
          if( editar === true) {
            const i = await getInstrumentosById(instrumentoId);
            setInstrumento(i);
          }
        }
        getInstrumento();
      }, [editar])
      
      
      
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
                    <Select
                      style={{ color: 'white', border: '1px solid #e2e2e1' }}
                      inputProps={{ style: { color: 'white' } }} 
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      defaultValue={ instrumento.instrumento }
                      label="Age"
                      fullWidth
                      onChange={handleChangeInput('instrumento')}
                    >
                      { nombres.map( (nombre, index) => (
                        <MenuItem key={index} value={nombre}>{nombre}</MenuItem>
                      ))}
                    </Select>
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
                        defaultValue={ instrumento.marca }
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
                        defaultValue={ instrumento.modelo }
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
                        defaultValue={ instrumento.numeroSerie }
                        fullWidth
                        focused
                        style={{ border: '1px solid #e2e2e1', borderRadius:'5px'}}
                        onChange={handleChangeInput('numeroSerie')}
                    />
                    </Grid>
                </Grid>
                <Box  sx={{mt:2, display:'flex', alignContent:'center', justifyContent:'center'}} >
                    { editar === undefined &&
                      <Button  aria-label='crear' color='secondary' sx={{ backgroundColor:'white', color:'black'}} variant='contained' onClick={handleForm}>
                        Crear instrumento
                      </Button>
                    }
                    { editar === true &&
                      <Button aria-label='crear' color='secondary' sx={{ backgroundColor:'white', color:'black'}} variant='contained' onClick={handleFormEditar}>
                        Editar instrumento
                      </Button>
                    } 
                </Box>
            </form>
          </Box>
        </Modal>
      </div>
  )
}
