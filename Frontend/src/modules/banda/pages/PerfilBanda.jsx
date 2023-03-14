import Avatar from '@material-ui/core/Avatar';
import { Box, Button, Grid, Tab, Tabs, Typography } from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Noticia, Plantilla } from '../../../Components';
import { Comentario } from '../../../Components/Comentario';
import { useAnunciosStore, useArchiverosStore, useAuthStore, useBandasStore, useComentariosStore, useDirectivosStore, useMusicosStore, useUploadsStore } from '../../../hooks';
import { useRedesSocialesStore } from '../../../hooks/useRedesSocialesStore';
import { EditarFoto } from '../../user';
import { NuevoAnuncio } from '../modals/NuevoAnuncio';
import { NuevoComentario } from '../modals/NuevoComentario';

const r = [ 'Email', 'Facebook', 'Instagram', 'Twitter', 'Youtube', 'Apple Music', ' Soundcloud', 'Spotify', 'TikTok' ]

export const PerfilBanda = () => {

  // Estados
  const [banda, setBanda] = React.useState([]);
  const [value, setValue] = React.useState(0);
  const [comentarios, setComentarios] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [ openAnuncio, setOpenAnuncio ] = useState(false);
  const [ openEditarFoto, setOpenEditarFoto ] = useState(false);
  const [ musicos, setMusicos ] = useState({});
  const [ usuariosMusicos, setUsuariosMusicos ] = useState([]);
  const [ usuariosDirectivos, setUsuariosDirectivos ] = useState([]);
  const [ fotoPerfil, setFotoPerfil ] = useState('');
  const [ directivos, setDirectivos ] = useState({});
  const [ redesSociales, setRedesSociales ] = useState([]);
  const [ perteneceMusico, setPerteneceMusico ] = useState(false);
  const [ perteneceDirectivo, setPerteneceDirectivo ] = useState(false);
  const [ anuncios, setAnuncios ] = useState([]);
  

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

  const handleCloseAnuncio = (event, newValue) => {
    event.preventDefault();
    setOpenAnuncio(false);
  };


  const handleOpenAnuncio = (event, newValue) => {
    event.preventDefault();
    setOpenAnuncio(true);
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
    setComentarios(
      [...comentarios.filter((c) => c._id !== comentarioId)]
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
  const { getAllByBandaId } = useRedesSocialesStore();
  const { getNoticiasByBanda } = useAnunciosStore();
  
  useEffect(() => {
    const getBanda = async () => {
      const userreq = await getBandaById(bandaId);
      setBanda(userreq);  
    }
    const getFotoPerfil = async () => {
      const foto = await getFotoPerfilBanda(bandaId);
      setFotoPerfil(foto);
    }
    const getRedes = async () => {
      const redes = await getAllByBandaId(bandaId);
      setRedesSociales(redes);
    }
    const getNoticias = async () => {
      const noticias = await getNoticiasByBanda(bandaId);
      setAnuncios(noticias);
    }
    getBanda();
    getFotoPerfil();
    getRedes();
    getNoticias();
  }, []);

  useEffect(() => {
    const esDirectivo = async () => {
      const directivos = await getDirectivosByBandaId(bandaId);
      const keys = Object.keys(directivos);
      for( let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const element = directivos[key];
        for(let j = 0; j < element.length; j++) {
          const mus = element[j];
          if(mus.usuario === user.uid) {
            setPerteneceDirectivo(true);
          }
        }
      }
    }
    esDirectivo();
  }, []);

  useEffect(() => {
    const getComentarios = async () => {
      const userreq = await getComentariosByBandaId(bandaId);
      setComentarios(userreq.reverse());
    }
    getComentarios();
  }, []);
  

  // Efectos  
  useEffect(() => {
    const getMusicos = async () => {
      const musreq = await getMusicosBanda(bandaId);
      setMusicos(musreq);
    }
    const getDirectivos = async () => {
      const dirreq = await getDirectivosByBandaId(bandaId);
      setDirectivos(dirreq);
    }
    getMusicos();
    getDirectivos();
  }, []);

  useEffect(() => {
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
    const getUsuariosDirectivos = async () => {
      let res = {}
      let keys = Object.keys(directivos);
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
      setUsuariosDirectivos(res);
    }
    getUsuariosMusicos();
    getUsuariosDirectivos();
  }, [musicos, directivos]);
 
  return (
    <>

      <NuevoComentario open={open} handleClose={handleClose} setOpen={setOpen} setComentarios={setComentarios}></NuevoComentario>
      <EditarFoto setFoto={setFotoPerfil} open={openEditarFoto} handleClose={handleCloseEditarFoto} setOpen={setOpenEditarFoto} tipo={"banda"}></EditarFoto>
      <NuevoAnuncio open={openAnuncio} handleClose={handleCloseAnuncio} setOpen={setOpenAnuncio} setAnuncios={setAnuncios}></NuevoAnuncio>
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
              { perteneceDirectivo ? 
                <a onClick={handleOpenEditarFoto}>
                  <Avatar  style={{ height: '150px', width: '150px' }} alt="Remy Sharp" src={`data:image/png;base64,${fotoPerfil}`} />
                </a>
                :
                <Avatar style={{ height: '150px', width: '150px' }} alt="Remy Sharp" src={`data:image/png;base64,${fotoPerfil}`} />
              }
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
            
            <Grid  sx={{ backgroundColor: '#262254'  }}>
                { redesSociales.map( (redSocial) => (
                  <Grid key={redSocial._id} item xs={4} display='inline-block'>
                    <Button sx={{backgroundColor:'white', color:'primary.main', mt:1, ml:2}} color='secondary' href={redSocial.url} size="small"variant='contained' align="center" >
                      { redSocial.nombre === 'Facebook' && <img src='/Imagenes/facebook.png'alt='logo'loading="lazy"/> }
                      { redSocial.nombre === 'Instagram' && <img src='/Imagenes/instagram.png'alt='logo'loading="lazy"/> }
                      { redSocial.nombre === 'Twitter' && <img src='/Imagenes/twitter.png'alt='logo'loading="lazy"/> }
                      { redSocial.nombre === 'Youtube' && <img src='/Imagenes/youtube.png'alt='logo'loading="lazy"/> }
                      { redSocial.nombre === 'Spotify' && <img src='/Imagenes/spotify.png'alt='logo'loading="lazy"/> }
                      { redSocial.nombre === 'Soundcloud' && <img src='/Imagenes/soundcloud.png'alt='logo'loading="lazy"/> }
                      { redSocial.nombre === 'Apple Music' && <img src='/Imagenes/music.png'alt='logo'loading="lazy"/> }
                      { redSocial.nombre === 'TikTok' && <img src='/Imagenes/tik-tok.png'alt='logo'loading="lazy"/> }
                      { redSocial.nombre === 'Email' && <img src='/Imagenes/email.png'alt='logo'loading="lazy"/> }
                      { ! r.includes(redSocial.nombre) && <img src='/Imagenes/enlace.png'alt='logo'loading="lazy"/>}
                    </Button>
                  </Grid>
                  ))
                }
            </Grid>
            { perteneceMusico &&
              <Box textAlign='center' sx={{mt:2}}>
                <Button  color="error" variant='contained' align="center" onClick={handleAbadonarBanda} >Abandonar Banda COMO MÚSICO</Button>
              </Box>
            }
            { perteneceDirectivo &&
              <>
              <Box textAlign='center' sx={{mt:2}}>
              <NavLink style={{textDecoration: "none", color: "black"}}  to={`/bandas/actualizar/${ banda._id }`}><Button  color="error" variant='contained' align="center"   >Editar datos de la banda</Button></NavLink>
              </Box>
              <Box textAlign='center' sx={{mt:2}}>
                <Button  color="secondary" variant='contained' align="center" ><NavLink style={{textDecoration: "none", color: "black"}}  to={`/banda/panel/${ banda._id }`}>Panel Directivo</NavLink></Button>
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
                  { value === 0 && perteneceDirectivo &&
                    <Button color='secondary' onClick={handleOpenAnuncio} sx={{ mx:'auto', mb:'5px', width:'30vh', maxWidth:'4opx', backgroundColor:'white', color:'black'}} variant='contained'>
                        <Typography sx={{ fontWeight: 'bold' }} >Añadir Anuncio</Typography>
                    </Button>
                  }
                  { value === 2 && 
                    <Button color='secondary' onClick={handleOpen} sx={{ mx:'auto', mb:'5px', width:'30vh', maxWidth:'4opx', backgroundColor:'white', color:'black'}} variant='contained'>
                        <Typography sx={{ fontWeight: 'bold' }} >Añadir Comentario</Typography>
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

                { value === 0 &&
                anuncios.map((anuncio, index) =>
                  <Noticia noticia={anuncio} index={index} eliminar={eliminarComentario}
                    key={index}
                    setNoticias={setAnuncios}
                  />
                )}
                { value === 2 &&
                comentarios.map((comentario, index) =>
                  <Comentario eliminar={eliminarComentario}
                    comentario={comentario}
                    key={index}
                  />
                )}

                { value === 5 &&
                  <>
                    <Plantilla musicos={musicos}  usuarios={usuariosMusicos} tipo='Músicos' directivo={perteneceDirectivo}/>
                    <Plantilla  musicos={directivos}  usuarios={usuariosDirectivos} tipo='Directivos'directivo={perteneceDirectivo} />
                  </>
                }
            </Grid>
          </Grid>
      </Grid>
    </>
  )

}

