
import Avatar from '@material-ui/core/Avatar';
import { Box, Button, Grid, Tab, Tabs, TextField, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AñadirEstudioModal, AñadirInstrumentoModal, EditarFoto } from '../';
import { Estudio, Instrumento, Experiencia } from '../../../Components';
import { useArchiverosStore, useDirectivosStore, useMusicosStore, useEstudiosStore, useInstrumentosStore, useUploadsStore } from '../../../hooks';
import { useAuthStore } from '../../../hooks/useAuthStore';

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
  const [ openEstudio, setOpenEstudio ] = React.useState(false);
  const [ openEditarFoto, setOpenEditarFoto ] = React.useState(false);
  const [userU, setUser] = React.useState([]);
  const [instrumentos, setInstrumentos] = useState([]);
  const [ estudios, setEstudios ] = useState([]);
  const [ fotoPerfil, setFotoPerfil ] = useState([]);
  const [ experiencias, setExperiencias ] = useState([]);
  const [ iguales, setIguales ] = useState(false);
  let navigate = useNavigate();

  // Funciones y parámetros
  const  { startUpdatePassword, user, startDelete } = useAuthStore();
  const  { getInstrumentosByUserId } = useInstrumentosStore();
  const  { getEstudiosByUserId } = useEstudiosStore();
  const { getFotoPerfilUsuario} = useUploadsStore();
  const { getArchiverosByUserId } = useArchiverosStore();
  const {  getDirectivoByUserId } = useDirectivosStore();
  const { getMusicosByUserId } = useMusicosStore();
 
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
            navigate('/');
        }
    });
  }
  const handleForm = e => {
    e.preventDefault();
    let error = ""
    if(values.contraseñaNueva != values.confirmarNueva ) error = "*La contraseña nueva no coincide con la confirmación \n";
    if(values.contraseñaNueva.length > 20 ) error = error + "*La contraseña debe de tener como máximo 200 caracteres \n";
    if(values.contraseñaNueva.length < 8 ) error = error + "*La contraseña debe de tener como mínimo 7 caracteres";

    if(error != "") {
      Swal.fire('Error al modificar contraseña', error, 'error');
    }
    else {
      const respuesta = startUpdatePassword({contraseñaNueva: values.confirmarNueva});
      setUser(respuesta);
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

  const handleOpenEditarFoto = (event, newValue, editar) => {
    event.preventDefault();
    setOpenEditarFoto(true);
  };

  const handleOpenEstudio = (event, newValue, editar) => {
    event.preventDefault();
    setOpenEstudio(true);
  };

  const handleCloseAñadir = (event, newValue) => {
    event.preventDefault();
    setOpenAñadir(false);
  };

  const handleCloseEstudio = (event, newValue) => {
    event.preventDefault();
    setOpenEstudio(false);
  };

  const handleCloseEditarFoto = (event, newValue) => {
    event.preventDefault();
    setOpenEditarFoto(false);
  };

  const eliminarInstrumento = (instrumentoId) => {
    // "current" contains the latest state array
    setInstrumentos((current) =>
      current.filter((c) => c._id !== instrumentoId)
    );
  };

  const eliminarEstudio = (estudioId) => {
    // "current" contains the latest state array
    const lista = [];
    for ( const estudio in estudios ) {
      if(estudio._id !== estudioId) {
        lista.push(estudio);
      }
    }
    setEstudios(lista);
  };

  const { getUserByiD } = useAuthStore();
  const { id } = useParams();


  useEffect(() => {
    const getUser = async () => {
      const userreq = await getUserByiD(id);
      userreq.fecha_nacimiento = new Date(userreq.fecha_nacimiento).toLocaleDateString();
      setUser(userreq);  
    }
    getUser();
  }, []);

  useEffect(() => {
    const getFotoPerfil = async () => {
      const resultado = await getFotoPerfilUsuario(id);
     
      setFotoPerfil(resultado);
    }
    getFotoPerfil();
  }, []);
    
  useEffect(() => {
    const getIguales = async () => {
      if( userU._id === user.uid ) setIguales(true);
    }
    getIguales();
  }, [ user, userU]);

  useEffect(() => {
    const getEstudios = async () => {
      const estudios = await getEstudiosByUserId(id);
      setEstudios(estudios);
    }
    getEstudios();
  }, []);

  useEffect(() => {
    const getInstrumentos = async () => {
      const instrumentos = await getInstrumentosByUserId(id);
      setInstrumentos(instrumentos);
    }
    getInstrumentos();
  }, []);
  // Efectos  
  useEffect(() => {
    const getExperiencias = async () => {
        const archiveros = await getArchiverosByUserId(id);
        const musicos = await getMusicosByUserId(id);
        const directivos = await getDirectivoByUserId(id);
        const union = archiveros.concat(musicos, directivos);
        union.sort((a, b) => a.fechaInicio - b.fechaInicio).reverse();
        let res = [];
        for(let i = 0; i < union.length; i++) {
          const u = union[i];
          u.fecha_inicio = new Date(union[i].fecha_inicio).toLocaleDateString();
          if(u.fecha_final) {
            u.fecha_final = new Date(union[i].fecha_final).toLocaleDateString();
          } else u.fecha_final = "Actualmente";
          res.push(u);
        }
        setExperiencias(res);
    }
    getExperiencias();
  }, []);


  return (
    <>

    <AñadirInstrumentoModal   open={openAñadir} handleClose={handleCloseAñadir} setOpen={setOpenAñadir} setInstrumentos={setInstrumentos}></AñadirInstrumentoModal>
    <AñadirEstudioModal  open={openEstudio} handleClose={handleCloseEstudio} setOpen={setOpenEstudio} setEstudios={setEstudios}></AñadirEstudioModal>
    <EditarFoto  setFoto={setFotoPerfil} open={openEditarFoto} handleClose={handleCloseEditarFoto} setOpen={setOpenEditarFoto} tipo={'usuario'}></EditarFoto>
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
            { iguales === true &&
            <a onClick={ handleOpenEditarFoto }>
              { fotoPerfil !== undefined && 
                <Avatar   style={{ height: '150px', width: '150px' }} alt="Remy Sharp" src={`data:image/png;base64,${fotoPerfil}`}  />
              }
            </a>
            }
            { iguales === false &&
              <>
              { fotoPerfil !== undefined && 
                <Avatar   style={{ height: '150px', width: '150px' }} alt="Remy Sharp" src={`data:image/png;base64,${fotoPerfil}`}  />
              }
              </>
            }
          </Grid>
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography sx={{ fontWeight: 'bold', mt:'10px', textAlign:'center' }} variant='h5'>{ userU.nombre } {userU.primer_apellido} {userU.segundo_apellido}</Typography>
          </Grid>
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography className='usuario' sx={{ fontWeight: 'bold', textAlign:'center' }} variant='h5'>@{userU.usuario}</Typography>
          </Grid>
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography variant='h6' sx={{textAlign:'center'}}>{userU.localidad} ({userU.provincia})</Typography>
          </Grid>
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography variant='h6' sx={{textAlign:'center'}}>{userU.fecha_nacimiento}</Typography>
          </Grid>
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography sx={{textDecoration: 'underline',  fontWeight: 'bold', mt:'10px', textAlign:'center' }} variant='h5'>Contacto</Typography>

          </Grid>
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography sx={{textAlign:'center'}} variant='h6'>{userU.correo}</Typography> 
          </Grid>
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography sx={{textAlign:'center'}} variant='h6'>{userU.telefono}</Typography> 
          </Grid>

          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography sx={{textDecoration: 'underline',  fontWeight: 'bold', mt:'10px', textAlign:'center' }} variant='h5'>Descripción</Typography>

          </Grid>
          <Grid 
          item
          justifyContent="center"
          alignItems="center" 
          xs= { 12 }
          sx={{ backgroundColor: 'white', justifyContent: "center", display: "flex"  }}
          >
            <Typography  sx={{textAlign: 'center'}} variant='h6'>{userU.descripcion}</Typography> 
          </Grid>
          
          { iguales === true &&
            <>
            <Box textAlign='center' sx={{mt:2}}>
              <Button  variant='contained' align="center" ><NavLink style={{textDecoration: "none", color: "white"}}  to={`/modificar/${id}`}>Modificar datos</NavLink></Button>
            </Box>
            <Box textAlign='center' sx={{mt:2}}>
              <Button  variant='contained' align="center"  onClick={handleOpen}>Modificar contraseña</Button>
            </Box>
            <Box textAlign='center' sx={{mt:2}}>
              <Button  variant='contained' align="center" color='error' onClick={handleDelete}>Eliminar cuenta</Button>
            </Box>
            </>
          }
          
          
          
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
                          <Tab  label="Experiencias" />
                          <Tab aria-label='click1' label="Instrumentos" />
                          <Tab aria-label='click2' label="Estudios" />
                        </Tabs>
                        { value === 1 && iguales === true &&
                          <Button color='secondary' onClick={handleOpenAñadir} sx={{ mx:'auto', mb:'5px', width:'20vh', maxWidth:'4opx', backgroundColor:'white', color:'black'}} variant='contained'>
                              <Typography sx={{ fontWeight: 'bold' }} >AÑADIR</Typography>
                          </Button>
                        }
                        { value === 2 && iguales === true &&
                          <Button color='secondary' onClick={handleOpenEstudio} sx={{ mx:'auto', mb:'5px', width:'20vh', maxWidth:'4opx', backgroundColor:'white', color:'black'}} variant='contained'>
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
              { value === 2 &&
                estudios.map((estudio, index) =>
                <Estudio 
                { ...estudio }
                key={index}
                eliminar={eliminarEstudio}
                setEstudios={setEstudios}
                iguales={iguales}
                />
              )}

              { value === 1 &&
                instrumentos.map((instrumento, index) =>
                <Instrumento 
                { ...instrumento }
                key={index}
                eliminar={eliminarInstrumento}
                setInstrumentos={setInstrumentos}
                iguales={iguales}
                />
              )}

              { value === 0 &&
                experiencias.map((experiencia, index) =>
                <Experiencia
                experiencia={experiencia}
                key={index}
                />
              )}
            </Grid>
        </Grid>
        
        
    </Grid>
    </>
  )
}
