import { Grid, Typography, Button, IconButton, Checkbox, FormControlLabel, Box, Tabs, Tab} from '@mui/material';
import Avatar from '@material-ui/core/Avatar';
import * as React from 'react';
import { NavBar, Plantilla } from '../../../Components';
import { useAuthStore, useBandasStore, useComentariosStore, useDirectivosStore, useMusicosStore, useUploadsStore } from '../../../hooks';
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
import { Comentario } from '../../../Components/Comentario';
import { NuevoComentario } from '../modals/NuevoComentario';
import { EditarFoto } from '../../user';


export const PerfilBanda = () => {

  // Estados
  const [banda, setBanda] = React.useState([]);
  const [value, setValue] = React.useState(0);
  const [comentarios, setComentarios] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [ openEditarFoto, setOpenEditarFoto ] = useState(false);
  const [ musicos, setMusicos ] = useState({});
  const [ usuariosMusicos, setUsuariosMusicos ] = useState([]);
  const [ fotoPerfil, setFotoPerfil ] = useState('');
  const [ directivos, setDirectivos ] = useState({});

  // Funciones
  const handleChange = (event, newValue) => {
      setValue(newValue);
  };

  const handleClose = (event, newValue) => {
    event.preventDefault();
    setOpen(false);
  };


  const handleOpen = (event, newValue) => {
    event.preventDefault();
    setOpen(true);
  };

  const handleOpenEditarFoto = (event, newValue) => {
    event.preventDefault();
    setOpenEditarFoto(true);
  };


  const handleCloseEditarFoto = (event, newValue) => {
    event.preventDefault();
    setOpenEditarFoto(false);
  };

  const eliminarComentario = (comentarioId) => {
    // "current" contains the latest state array
    setComentarios((current) =>
      current.filter((c) => c.id !== comentarioId)
    );
  };

  const handleAbadonarBanda = e => {
    e.preventDefault();
    Swal
    .fire({
        title: "¿Está seguro de que desea deja la banda?",
        text: "Esta acción será irreversible",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: "Sí, abandonar banda",
        cancelButtonText: "Cancelar",
    })
    .then(async resultado => {
        if (resultado.value) {
            // Hicieron click en "Sí"
            const c = await abandonarBanda(bandaId, user.uid);
            //Redireccionar al inicio
            navigate('/');
        }
    });
  }


  // Hooks
  const { getBandaById } = useBandasStore();
  const { getComentariosByBandaId } = useComentariosStore();
  const { bandaId } = useParams();
  const { abandonarBanda, getMusicosBanda } = useMusicosStore();
  const { getUserByiD } = useAuthStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { getFotoPerfilBanda } = useUploadsStore();
  const { getDirectivosByBandaId } = useDirectivosStore();

  

  // Efectos  
  useEffect(() => {
    const getBanda = async () => {
      const userreq = await getBandaById(bandaId);
      setBanda(userreq);  
    }
    const getComentarios = async () => {
      const userreq = await getComentariosByBandaId(bandaId);
      setComentarios(userreq.reverse());
    }
    const getMusicos = async () => {
      const musreq = await getMusicosBanda(bandaId);
      const dirreq = await getDirectivosByBandaId(bandaId);
      const modelo = Object.assign({}, musreq, dirreq);
      setMusicos(modelo);
    }
    const getUsuariosMusicos = async () => {
      let keys = Object.keys(musicos);
      let res = {}

      for( let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const element = musicos[key];
        let lista = []
        for(let j = 0; j < element.length; j++) {
          const mus = element[j];
          const usuario = await getUserByiD(mus.usuario)
          lista.push(usuario);
        }
        res[key] = lista;
      }

      keys = Object.keys(directivos);
      for( let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const element = directivos[key];
        let lista = []
        for(let j = 0; j < element.length; j++) {
          const mus = element[j];
          const usuario = await getUserByiD(mus.usuario)
          lista.push(usuario);
        }
        res[key] = lista;
      }
      setUsuariosMusicos(res);
    }
    const getFotoPerfil = async () => {
      const foto = await getFotoPerfilBanda(bandaId);
      setFotoPerfil(foto);
    }
    getBanda();
    getComentarios();
    getMusicos();
    getUsuariosMusicos();
    getFotoPerfil()
  },[ comentarios, musicos ]);
  
 

  return (
    <>
    <NavBar/>
      <NuevoComentario open={open} handleClose={handleClose} setOpen={setOpen} setComentarios={setComentarios}></NuevoComentario>
      <EditarFoto open={openEditarFoto} handleClose={handleCloseEditarFoto} setOpen={setOpenEditarFoto} tipo={"banda"}></EditarFoto>
      <Grid 
        container 
     
      >
        <Grid 
          item
          lg={3}
          xs= { 12 }
          sx={{minHeight: '50vh', padding: 4, margin:'10px', backgroundColor: '#262254', borderRadius: '25px', boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)' }}
          
          >
            <Grid 
            item
            justifyContent="center"
            alignItems="center" 
            xs= { 12 }
            sx={{  justifyContent: "center", display: "flex", backgroundColor: '#262254'  }}
            >
              <a onClick={handleOpenEditarFoto}>
                <Avatar style={{ height: '150px', width: '150px' }} alt="Remy Sharp" src={`data:image/png;base64,${fotoPerfil}`} />
              </a>
            </Grid>
            <Grid 
            item
            justifyContent="center"
            alignItems="center" 
            xs= { 12 }
            sx={{  justifyContent: "center", display: "flex" ,  backgroundColor: '#262254' }}
            >
              <Typography color='white' sx={{ fontWeight: 'bold', mt:'10px', textAlign:'center' }} variant='h5'>{ banda.tipo } { banda.nombre }</Typography>
            </Grid>
            <Grid 
            item
            justifyContent="center"
            alignItems="center" 
            xs= { 12 }
            sx={{  justifyContent: "center", display: "flex",  backgroundColor: '#262254'  }}
            >
              <Typography color='white' sx={{ fontWeight: 'bold' }} variant='h5'>Fundada en { banda.año_fundacion }</Typography>
            </Grid>
            <Grid 
            item
            justifyContent="center"
            alignItems="center" 
            xs= { 12 }
            sx={{  justifyContent: "center", display: "flex",  backgroundColor: '#262254'  }}
            >
              <Typography color='white' variant='h6'>{banda.localidad} ({banda.provincia})</Typography>
            </Grid>
            <Grid 
            item
            justifyContent="center"
            alignItems="center" 
            xs= { 12 }
            sx={{  justifyContent: "center", display: "flex",  backgroundColor: '#262254'  }}
            >
              <Typography color='white' variant='h6'>{banda.codigo_postal}</Typography>
            </Grid>
            <Grid 
            item
            justifyContent="center"
            alignItems="center" 
            xs= { 12 }
            sx={{  justifyContent: "center", display: "flex",  backgroundColor: '#262254'  }}
            >
              <Typography color='white' variant='h6'>{banda.direccion}</Typography>
            </Grid>
            
            <Grid 
            item
            justifyContent="center"
            alignItems="center" 
            xs= { 12 }
            sx={{  justifyContent: "center", display: "flex",  backgroundColor: '#262254'  }}
            >
              <Typography color='white' sx={{textDecoration: 'underline',  fontWeight: 'bold', mt:'10px' }} variant='h5'>Contacto</Typography>

            </Grid>
            <Grid 
            item
            justifyContent="center"
            alignItems="center" 
            xs= { 12 }
            sx={{  justifyContent: "center", display: "flex",  backgroundColor: '#262254'  }}
            >
              <Typography color='white' variant='h6'>{banda.correo}</Typography> 
            </Grid>
            <Grid 
            item
            justifyContent="center"
            alignItems="center" 
            xs= { 12 }
            sx={{  justifyContent: "center", display: "flex",  backgroundColor: '#262254'  }}
            >
              <Typography  color='white' variant='h6'>{banda.telefono}</Typography> 
            </Grid>

            <Grid 
            item
            justifyContent="center"
            alignItems="center" 
            xs= { 12 }
            sx={{ justifyContent: "center", display: "flex",  backgroundColor: '#262254'  }}
            >
              <Typography color='white' sx={{textDecoration: 'underline',  fontWeight: 'bold', mt:'10px' }} variant='h5'>Descripción</Typography>

            </Grid>
            <Grid 
            item
            justifyContent="center"
            alignItems="center" 
            xs= { 12 }
            sx={{  justifyContent: "center", display: "flex",  backgroundColor: '#262254'  }}
            >
              <Typography color='white' sx={{textAlign: 'center'}} variant='h6'>{banda.descripcion}</Typography> 
            </Grid>

            <Box textAlign='center' sx={{mt:2}}>
              <Button  color="secondary" variant='contained' align="center" onClick={handleAbadonarBanda} >Abandonar Banda</Button>
            </Box>
            <Box textAlign='center' sx={{mt:2}}>
              <Button  color="secondary" variant='contained' align="center" ><NavLink style={{textDecoration: "none", color: "black"}}  to={`/banda/panel/${ banda._id }`}>Panel Directivo</NavLink></Button>
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
                alignItems="center"
              
                > 
                <Box  xs={12}   sx={{ width: '95%', color:'white',display:"flex", justifyContent: 'space-evenly', flexDirection:'column', backgroundColor:'#262254', borderRadius:'5px' }}>
                  <Tabs value={value} onChange={handleChange} textColor='inherit' centered sx={{
                    '& .MuiTabs-flexContainer': {
                      flexWrap: 'wrap',
                    }
                  }}>
                    <Tab label="Anuncios" />
                    <Tab label="Eventos" />
                    <Tab label="Comentarios" />
                    <Tab label="Encuestas" />
                    <Tab label="Repertorios" />
                    <Tab label="Plantilla" />
                    
                  </Tabs>
                  { value === 2 &&
                    <Button color='secondary' onClick={handleOpen} sx={{ mx:'auto', mb:'5px', width:'20vh', maxWidth:'4opx', backgroundColor:'white', color:'black'}} variant='contained'>
                        <Typography sx={{ fontWeight: 'bold' }} >+</Typography>
                    </Button>
                  }
                </Box>
                
            </Grid>
            <Grid 
                container
                sx = {{ mt: 3}}
                displey="flex"
                justifyContent="center"
                alignItems="center"
              > 
                { value === 2 &&
                comentarios.map((comentario, index) =>
                  <Comentario eliminar={eliminarComentario}
                    { ...comentario }
                    key={index}
                  />
                )}

                { value === 5 &&
                  <Plantilla musicos={musicos} key={"asdasdas"} usuarios={usuariosMusicos} />
                }
            </Grid>
          </Grid>
      </Grid>
    </>
  )

}

