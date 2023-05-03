import { Box, Button, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Modal from '@mui/material/Modal';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../../hooks/useAuthStore';
import CircularProgress from '@mui/material/CircularProgress';
import { validarInstrumentos } from '../../../helpers/validarInstrumento';
import { useInstrumentosStore } from '../../../hooks/useInstrumentosStore';
import { useBandasStore, usePrestamosStore, useVestimentasStore } from '../../../hooks';
import { useParams } from 'react-router-dom';


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

export const NuevoPrestamo  = ( { open, handleClose, setPrestamoIns, setOpen, instrumentoId, vestimentaId }) => {
    
    // Estados
    const [prestamo, setPrestamo] = useState({comentario:'', usuario:''});
    const [ options, setOptions ] = useState([]);
    const { bandaId } = useParams();
    const [openBuscador, setOpenBuscador] = React.useState(false);
    const loading = open && options.length === 0;

    // Funciones
    const { crearPrestamo } = usePrestamosStore();
    const { obtenerTodosCompontesBanda } = useBandasStore();

    const validarPrestamo =  () => {
      let error = "";
      if( ! prestamo.comentario.length > 500 ) {
        error = "El comentario debe tener menos de 500 caracteres";
      }

      return error;
    }

    const handleForm = async e => {
        e.preventDefault();
        let error = validarPrestamo();

        if(error != "") {
          Swal.fire('Error al publicar préstamo', error, 'error');
        }
        else {
          if(instrumentoId ) {
              prestamo.tipo = 'Instrumento';
              const c = await crearPrestamo( prestamo, instrumentoId );
              if( c._id) {
                  c.fechaInicio = new Date(c.fechaInicio).toDateString();
                  Swal.fire('Prestamo creado', 'Prestamo creado correctamente', 'success');
                  setPrestamoIns(c);
                  setOpen(false);
              }
          } else {
              prestamo.tipo = 'Vestimenta';
              const c = await crearPrestamo( prestamo, vestimentaId );
              if( c._id) {
                  c.fechaInicio = new Date(c.fechaInicio).toDateString();
                  Swal.fire('Prestamo creado', 'Prestamo creado correctamente', 'success');
                  setPrestamoIns(c);
                  setOpen(false);
              }
          }
            
        }
      }
    
      const handleChangeInput = input => e => {    
        prestamo[input] =  e.target.value;
      }

      const handleChange = (event, values) => {
        event.preventDefault();
        prestamo['usuario'] = values._id;
      }

    useEffect(() => {
        const getOptions = async () => {
            const componentes = await obtenerTodosCompontesBanda(bandaId);
            setOptions(componentes);
        }
        getOptions();
    }, []);
    
      
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
                      Prestar Instrumento
                    </Typography>
                <Grid container>
                    <Grid item xs={ 12 } sx={{ mt: 2}}>
                    <Typography  sx={{ color:'white'}} >
                      Comentario sobre el préstamo
                    </Typography>
                      <TextField 
                        sx={{ input: { color: 'white' }}}
                        inputProps={{ style: { color: 'white' } }}
                        style={{ border: '1px solid #e2e2e1', borderRadius:'5px'}}
                        type="text"
                        placeholder="Escriba aquí un comentario..."
                        fullWidth
                        onChange={handleChangeInput('comentario')}
                        rows={3}
                        multiline
                      />
                    </Grid>
                    <Grid item xs={ 12 } sx={{ mt: 2}}>
                      <Typography  sx={{ color:'white'}} >
                      Usuario
                      </Typography>
                      <Autocomplete
                      onChange={handleChange}
                      freeSolo={true}
                      id="asynchronous-demo"
                      sx={{ minWidth:'320px', backgroundColor: 'white', borderRadius: '5px', height: '50px' }}
                      open={openBuscador}
                      onOpen={() => {
                        setOpenBuscador(true);
                      }}
                      onClose={() => {
                        setOpenBuscador(false);
                      }}
                      isOptionEqualToValue={(option, value) => option.usuario === value.usuario}
                      getOptionLabel={(option) => option.usuario? option.usuario : "" }
                      options={options}
                      loading={loading}
                      renderInput={(params) => (
                        <TextField
                        sx={{ input: { color: 'white' }}}
                        inputProps={{ style: { color: 'white' } }}
                        style={{ backgroundColor:'#262254', border: '1px solid #e2e2e1', borderRadius:'5px'}}
                          {...params}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                </Grid>
                </Grid>
                <Box  sx={{mt:2, display:'flex', alignContent:'center', justifyContent:'center'}} >
                   
                      <Button  aria-label='crear' color='secondary' sx={{ backgroundColor:'white', color:'black'}} variant='contained' onClick={handleForm}>
                        Crear vestimenta
                      </Button>
                  
                </Box>
            </form>
          </Box>
        </Modal>
      </div>
  )
}