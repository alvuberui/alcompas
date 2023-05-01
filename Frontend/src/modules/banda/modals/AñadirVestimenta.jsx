import { Box, Button, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../hooks/useAuthStore';

import { validarInstrumentos } from '../../../helpers/validarInstrumento';
import { useInstrumentosStore } from '../../../hooks/useInstrumentosStore';
import { useVestimentasStore } from '../../../hooks';

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
const nombres = ['Camisa', 'Pantalones', 'Chaqueta', 'Corbata', 'Gorro', 'Polo'];

export const AñadirVestimenta  = ( { open, handleClose, setVestimentas, setOpen, editar, banda, vestimentaAntigua }) => {
    
    // Estados
    const [vestimenta, setVestimenta] = useState({tipo:'Camisa'});

    // Funciones
    const { crearVestimenta, editarVestimenta } = useVestimentasStore();
    const { user } = useAuthStore();

    const validarVestimenta =  () => {
      let error = "";
      const tipos = ['Camisa', 'Pantalones', 'Chaqueta', 'Corbata', 'Gorro', 'Polo'];
      if( ! tipos.includes(vestimenta.tipo)) {
        error = "El tipo de vestimenta es inválido";
      }

      return error;
    }

    const handleFormEditar = async e => {
      e.preventDefault();
        let error = validarVestimenta();
      if(error != "") {
        Swal.fire('Error al editar vestimenta', error, 'error');
      }
      else {
            vestimenta.banda = banda;
          const c = await editarVestimenta( vestimenta );
          setVestimentas( co => [...co, c].filter( i => i._id !== vestimentaAntigua._id) );
          setVestimentas( co => [...co, c]);
          setVestimenta({tipo:'Camisa'});
          setOpen(false);
      }
    }
   
    const handleForm = async e => {
        e.preventDefault();
        let error = validarVestimenta();

        if(error != "") {
          Swal.fire('Error al publicar vestimenta', error, 'error');
        }
        else {
            const c = await crearVestimenta( vestimenta, banda );
            setVestimentas( co => [...co, c]);
            setVestimenta({tipo:'Camisa'});
            setOpen(false);
        }
      }
    
      const handleChangeInput = input => e => {    
        vestimenta[input] =  e.target.value;
      }

        useEffect(() => {
            if( editar === true && vestimentaAntigua ) {
                setVestimenta( vestimentaAntigua );
            }
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
                      Añadir Vestimenta
                    </Typography>
                <Grid container>
                    <Grid item xs={ 12 } sx={{ mt: 2}}>
                    <Typography  sx={{ color:'white'}} >
                      Tipo de vestimenta
                    </Typography>
                    <Select
                      style={{ color: 'white', border: '1px solid #e2e2e1' }}
                      inputProps={{ style: { color: 'white' } }} 
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      defaultValue={ vestimenta.tipo }
                      label="Age"
                      fullWidth
                      onChange={handleChangeInput('tipo')}
                    >
                      { nombres.map( (nombre, index) => (
                        <MenuItem key={index} value={nombre}>{nombre}</MenuItem>
                      ))}
                    </Select>
                    </Grid>
                </Grid>
                <Box  sx={{mt:2, display:'flex', alignContent:'center', justifyContent:'center'}} >
                    { editar === undefined &&
                      <Button  aria-label='crear' color='secondary' sx={{ backgroundColor:'white', color:'black'}} variant='contained' onClick={handleForm}>
                        Crear vestimenta
                      </Button>
                    }
                    { editar === true &&
                      <Button aria-label='crear' color='secondary' sx={{ backgroundColor:'white', color:'black'}} variant='contained' onClick={handleFormEditar}>
                        Editar vestimenta
                      </Button>
                    } 
                </Box>
            </form>
          </Box>
        </Modal>
      </div>
  )
}