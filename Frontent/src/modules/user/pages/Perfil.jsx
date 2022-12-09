
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
import { useNavigate } from 'react-router-dom';
import {
  BrowserRouter as Router,
  Link,
  NavLink,
}  from "react-router-dom";
import { Instrumento } from '../../../Components/Intrumento';
import { AñadirInstrumentoModal } from '../';
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

let values = {
  contraseñaActual: '',
  contraseñaNueva: '',
  confirmarNueva: ''
}

export const Perfil = () => {

  // Estados
  const [value, setValue] = React.useState(0);
  const [values, setValues] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [openAñadir, setOpenAñadir] = React.useState(false);
  const [user, setUser] = React.useState([]);
  const [instrumentos, setInstrumentos] = useState([]);
  let navigate = useNavigate();

  // Funciones y parámetros
  const  { startUpdatePassword, errorMessage, startDelete } = useAuthStore();
  const  { getInstrumentosByUserId } = useInstrumentosStore();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleDelete = e => {
    e.preventDefault();
    Swal
    .fire({
        title: "¿Está seguro de que desea eliminar su cuenta?",
        text: "Esta acción será irreversible y no podrá recuperar su cuenta más tarde",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
    })
    .then(resultado => {
        if (resultado.value) {
            // Hicieron click en "Sí"
            startDelete()
        }
    });
  }
  const handleForm = e => {
    e.preventDefault();
    let error = ""
    if(values.contraseñaNueva != values.confirmarNueva ) error = "*La contraseña nueva no coincide con la confirmación \n";
    if(values.contraseñaNueva.length > 20 ) error = error + "*La contraseña debe de tener como máximo 20 caracteres \n";
    if(values.contraseñaNueva.length < 5 ) error = error + "*La contraseña debe de tener como mínimo 5 caracteres";

    if(error != "") {
      Swal.fire('Error al modificar contraseña', error, 'error');
    }
    else {
      const respuesta = startUpdatePassword({contraseñaNueva: values.confirmarNueva});
      setOpen(false);
    }
  }

  const handleChangeInput = input => e => {    
    values[input] =  e.target.value;
  }
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenAñadir = (event, newValue, editar) => {
    event.preventDefault();
    setOpenAñadir(true);
  };

  const handleCloseAñadir = (event, newValue) => {
    event.preventDefault();
    setOpenAñadir(false);
  };

  const eliminarInstrumento = (instrumentoId) => {
    // "current" contains the latest state array
    setInstrumentos((current) =>
      current.filter((c) => c.id !== instrumentoId)
    );
  };

  const { getUserByiD } = useAuthStore();
  const { id } = useParams();

  // Efectos  
  useEffect(() => {
    const getUser = async () => {
      const userreq = await getUserByiD(id);
      setUser(userreq);  
    }
    const getInstrumentos = async () => {
      const instrumentos = await getInstrumentosByUserId(id);
      setInstrumentos(instrumentos);
    }
    getUser();
    getInstrumentos();
  }, [instrumentos]);

  return (
    <>
    <NavBar/>
    <AñadirInstrumentoModal  open={openAñadir} handleClose={handleCloseAñadir} setOpen={setOpenAñadir} setInstrumentos={setInstrumentos}></AñadirInstrumentoModal>
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
                      Modificar Contraseña
                    </Typography>
                <Grid container>
                    <Grid item xs={ 12 } sx={{ mt: 2}}>
                    <Typography  sx={{ color:'white'}} >
                      Nueva contraseña
                    </Typography>
                    <TextField 
                        sx={{ input: { color: 'white' }}}
                        type="password"
                        placeholder="Nueva contraseña"
                        fullWidth
                        focused
                        style={{ border: '1px solid #e2e2e1', borderRadius:'5px'}}
                        onChange={handleChangeInput('contraseñaNueva')}
                    />
                    </Grid>
                    <Grid item xs={ 12 } sx={{ mt: 2}}>
                    <Typography  sx={{ color:'white'}} >
                      Confirmar nueva contraseña
                    </Typography>
                    <TextField 
                        sx={{ input: { color: 'white' }}}
                        type="password"
                        placeholder="Confirmar nueva contraseña"
                        fullWidth
                        focused
                        style={{ border: '1px solid #e2e2e1', borderRadius:'5px'}}
                        onChange={handleChangeInput('confirmarNueva')}
                    />
                    </Grid>
                    <Grid item  xs={ 12 } sx={{ mt: 2}}>
                      <Typography variant='h7'  sx={{ color:'white'}} >
                        * Esta modificación será irreversible y ya no podrá deshacerla.
                      </Typography>
                    </Grid>

                </Grid>
                <Box  sx={{mt:2, display:'flex', alignContent:'center', justifyContent:'center'}} >
                      <Button color='secondary' sx={{ backgroundColor:'white', color:'black'}} variant='contained' onClick={handleForm}>
                        Cambiar contraseña
                      </Button>
                </Box>
            </form>
          </Box>
        </Modal>
      </div>
    <Grid 
      container 
    >
      <Grid 
        item
        lg={3}
        xs= { 12 }
        sx={{minHeight: '50vh', padding: 4 }}
        >
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Avatar   style={{ height: '150px', width: '150px' }} alt="Remy Sharp" src="/static/images/avatar/1.jpg"  />
          </Grid>
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography sx={{ fontWeight: 'bold', mt:'10px' }} variant='h5'>{ user.nombre } {user.primer_apellido} {user.segundo_apellido}</Typography>
          </Grid>
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography sx={{ fontWeight: 'bold' }} variant='h5'>@{user.usuario}</Typography>
          </Grid>
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography variant='h6'>{user.localidad} ({user.provincia})</Typography>
          </Grid>
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography variant='h6'>{user.fecha_nacimiento}</Typography>
          </Grid>
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography sx={{textDecoration: 'underline',  fontWeight: 'bold', mt:'10px' }} variant='h5'>Contacto</Typography>

          </Grid>
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography  variant='h6'>{user.correo}</Typography> 
          </Grid>
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography  variant='h6'>{user.telefono}</Typography> 
          </Grid>

          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography sx={{textDecoration: 'underline',  fontWeight: 'bold', mt:'10px' }} variant='h5'>Descripción</Typography>

          </Grid>
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography  sx={{textAlign: 'center'}} variant='h6'>{user.descripcion}</Typography> 
          </Grid>

          <Box textAlign='center' sx={{mt:2}}>
            <Button  variant='contained' align="center" ><NavLink style={{textDecoration: "none", color: "white"}}  to={`/modificar/${id}`}>Modificar datos</NavLink></Button>
          </Box>
          <Box textAlign='center' sx={{mt:2}}>
            <Button  variant='contained' align="center"  onClick={handleOpen}>Modificar contraseña</Button>
          </Box>
          <Box textAlign='center' sx={{mt:2}}>
            <Button  variant='contained' align="center"  onClick={handleDelete}>Eliminar cuenta</Button>
          </Box>
          
          
        </Grid>

        <Grid 
          item
          lg={8}
          xs= { 12 }
          sx={{minHeight: '50vh', padding: 4 }}
          >
          <Grid 
                container
                sx = {{ mt: 5 }}
                displey="flex"
                justifyContent="center"
                alignItems="center">
                <Box  xs={12}   sx={{ width: '95%', color:'white',display:"flex", justifyContent: 'space-evenly', flexDirection:'column', backgroundColor:'#262254', borderRadius:'5px' }}>
                        <Tabs value={value} onChange={handleChange} textColor='inherit' centered sx={{
                          '& .MuiTabs-flexContainer': {
                            flexWrap: 'wrap',
                          }
                        }}>
                          <Tab label="Experiencias" />
                          <Tab label="Instrumentos" />
                          <Tab label="Estudios" />
                        </Tabs>
                        { value === 1 &&
                          <Button color='secondary' onClick={handleOpenAñadir} sx={{ mx:'auto', mb:'5px', width:'20vh', maxWidth:'4opx', backgroundColor:'white', color:'black'}} variant='contained'>
                              <Typography sx={{ fontWeight: 'bold' }} >AÑADIR</Typography>
                          </Button>
                        }
                  </Box>
            </Grid>
            <Grid 
            container
            sx = {{ mt: 3 }}
            displey="flex"
            justifyContent="center"
            alignItems="center"
            > 
              { value === 1 &&
                instrumentos.map((instrumento, index) =>
                <Instrumento 
                { ...instrumento }
                key={index}
                eliminar={eliminarInstrumento}
                setInstrumentos={setInstrumentos}
                />
              )}
            </Grid>
        </Grid>
        
        
    </Grid>
    </>
  )
}
