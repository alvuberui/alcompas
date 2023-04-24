import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { ListItem, Box, ListItemButton, CircularProgress } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Collapse from '@mui/material/Collapse';
import { red } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAnunciosStore, useAuthStore, useBandasStore, useDirectivosStore, useEventosStore, useLikesStore, useUploadsStore } from '../hooks';
import { NavLink } from 'react-router-dom';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import { PublicarAsistenciaModal } from '../modules/eventos/modals/PublicarAsistenciaModal';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

export const Evento = ({ evento, index, style, setEventos }) => {

    // Estados
    const [expanded, setExpanded] = useState(false);
    const [banda, setBanda] = useState({});
    const [fotoPerfil, setFotoPerfil] = useState('');
    const [ esDirectivo, setEsDirectivo ] = useState(false);
    const [ tipoEvento, setTipoEvento ] = useState('');
    const [ pertenece, setPertenece ] = useState(false);
    const [ isLiked, setIsLiked ] = useState(false);
    const [ numeroLikes, setNumeroLikes ] = useState(0);
    const [ open, setOpen ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true);
    const horaSalida  = new Date(evento.fechaSalida).getHours() + ":" + new Date(evento.fechaSalida).getMinutes();
    const fechaSalida = new Date(evento.fechaSalida).toLocaleDateString();
    const horaInicio = new Date(evento.fechaInicio).getHours() + ":" + new Date(evento.fechaInicio).getMinutes();
    const fechaInicio = new Date(evento.fechaInicio).toLocaleDateString();
    const horaFin  = new Date(evento.fechaFin).getHours() + ":" + new Date(evento.fechaFin).getMinutes();
    const fechaFin = new Date(evento.fechaFin).toLocaleDateString();


    // Hooks
    const { deleteByTipoId } = useEventosStore();
    const { getBandaById, perteneceUsuarioBanda } = useBandasStore();
    const { getFotoPerfilBanda } = useUploadsStore();
    const { user } = useAuthStore();
    const { getDirectivoByUserId } = useDirectivosStore();
    const { publicarLike, publicarDislike, getLikeByTipoAndReferencia, errores,
        getNumeroLikes } = useLikesStore();



    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        const getFoto = async () => {
            const fotoreq = await getFotoPerfilBanda(evento.banda);
            setFotoPerfil(fotoreq);
        }
         
        getFoto();
    }, [evento]);

    useEffect(() => {
        const getBanda = async () => {
            const bandareq = await getBandaById(evento.banda);
            bandareq.titulo = bandareq.tipo + " " + bandareq.nombre;
            setBanda(bandareq);
        }
        getBanda();
    }, [evento]);


    useEffect(() => {
        const getTipo = async () => {
            if( evento.tematica ) {
                setTipoEvento('Ensayo');
            } else if( evento.tipo) {
                setTipoEvento('Procesión');
            } else 
                setTipoEvento('Actuación');
        }
        getTipo();
    }, [evento]);

    useEffect(() => {
        if( errores === 'No se pudo completar el dislike') {
            Swal.fire('Error', 'No se pudo eliminar el dislike', 'error');
            setIsLiked(true);
        } else if(errores === 'No se pudo completar el like') {
            Swal.fire('Error', 'No se pudo eliminar el like', 'error');
            setIsLiked(false);
        }
        
    }, [errores])
    
    const handleLike = e => {
        e.preventDefault();
        let t = null;
            if(tipoEvento === 'Actuación') {
                t = 'Actuacion';
            } else if(tipoEvento === 'Procesión') {
                t = 'Procesion';
            } else {
                t = 'Ensayo';
            }
        const like = { 'usuario': user.uid, 'referencia': evento._id, 'tipo': t };
        publicarLike(like);
        setIsLiked(true);
        setNumeroLikes(numeroLikes + 1);
    }
    
    const handleDislike = e => {
        e.preventDefault();
        let t = null;
            if(tipoEvento === 'Actuación') {
                t = 'Actuacion';
            } else if(tipoEvento === 'Procesión') {
                t = 'Procesion';
            } else {
                t = 'Ensayo';
            }
        const like = { 'referencia': evento._id, 'tipo': t };
        publicarDislike(like);   
        setIsLiked(false);    
        setNumeroLikes(numeroLikes - 1);
    }

    // Efectos
    useEffect(() => {
        const getLike = async () => {
            if(evento._id && tipoEvento) {
                let t = null;
                if(tipoEvento === 'Actuación') {
                    t = 'Actuacion';
                } else if(tipoEvento === 'Procesión') {
                    t = 'Procesion';
                } else {
                    t = 'Ensayo';
                }
            const like = await getLikeByTipoAndReferencia({ tipo: t, referencia: evento._id });
            
            if(like) {
                setIsLiked(true);
            } else {
                setIsLiked(false);
            }
            }
        }  
        getLike();
    }, [  evento, tipoEvento ]);

    useEffect(() => {
        const getNumeroLikesF = async () => {
        if(evento._id && tipoEvento) {
            let t = null;
      
            if(tipoEvento === 'Actuación') {
                t = 'Actuacion';
            } else if(tipoEvento === 'Procesión') {
                t = 'Procesion';
            } else {
                t = 'Ensayo';
            }
            
                const numeroLikes = await getNumeroLikes({ tipo: t, referencia: evento._id });
                setNumeroLikes(numeroLikes);
      
      }
    }
    getNumeroLikesF();
    }, [  evento, tipoEvento ]);

    


    


    useEffect(() => {
        const esDirectivo = async () => {
            const directivos = await getDirectivoByUserId(user.uid);
            for( let i = 0; i < directivos.length; i++ ){
                if( directivos[i].banda === banda._id && !directivos[i].fecha_final ) {
                    setEsDirectivo(true);
                    break;
                }
            }
        }
        const perteneceUsuarioBandaF = async () => {
            
            const pertenece = await perteneceUsuarioBanda(user.uid, evento.banda);
            setPertenece(pertenece);
        }
        esDirectivo();
        perteneceUsuarioBandaF();
    }, [evento, user, banda]);

    const handleDelete = async () => {
        Swal
            .fire({
                title: "¿Está seguro de que desea eliminar el evento?",
                text: "Esta acción será irreversible",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            })
            .then(async resultado => {
                if (resultado.value) {
                    const noticiaDelete = await deleteByTipoId(tipoEvento, evento._id);
                    // Eliminar noticia en setNoticias
                    setEventos( eventos => eventos.filter( not => not._id !== noticiaDelete._id ) );
                }
            }).then(() => {
                Swal.fire({
                    title: "Evento eliminado",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                });
            });
    }
    
    useEffect(() => {
        const isLoading = async () => {

                
            if( evento != undefined && banda != undefined && esDirectivo != undefined && 
                fotoPerfil != undefined && isLiked != undefined && numeroLikes != undefined && pertenece != undefined && tipoEvento != undefined  ) {
                
                setIsLoading(false);
            } else {
                setIsLoading(true);
            }
        }
        isLoading();
    }, [evento, banda, esDirectivo, fotoPerfil, isLiked, numeroLikes, pertenece, tipoEvento]);

    const handleOpen = ( ) => {

        setOpen(true);
    };

    const handleClose = () => {
  
        setOpen(false);
    };
    
    if( !isLoading  ) {

    return (
        <>
        { open &&
        <PublicarAsistenciaModal open={open} handleClose={handleClose} evento={evento} setOpen={setOpen} tipo={tipoEvento}/>
        }
        <ListItem style={style} key={index} component="div" disablePadding>
            <ListItemButton>
                <Card sx={{ width: '100%' }}>
                    <CardHeader
                        avatar={ <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" src={`data:image/png;base64,${fotoPerfil}`}></Avatar>}

                        action={
                            <>
                            { esDirectivo &&
                            <>
                            <NavLink to={`/banda/panel/eventos/asistencia/${evento._id}/${tipoEvento}/`}>
                                <IconButton aria-label="settings">
                                <VisibilityIcon />
                                </IconButton>
                            </NavLink >
                            
                            <NavLink to={`/banda/panel/eventos/editar/${tipoEvento}/${evento._id}`}>
                                <IconButton aria-label="settings">
                                <EditIcon />
                                </IconButton>
                            </NavLink >
                            
                            <IconButton onClick={handleDelete} aria-label="settings">
                                <DeleteIcon />
                            </IconButton>
                            </>
                            }
                            { pertenece &&
                            <IconButton onClick={handleOpen} aria-label="settings">
                                <AddToPhotosIcon />
                            </IconButton>
                            }
                            </>
                        }
                        title= {banda.titulo}
                    />
                    <CardContent>
                        <Typography variant="body1" textTransform={'uppercase'} color="text.primary">
                        {tipoEvento} - {evento.titulo}
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                        { isLiked ?
                        <IconButton onClick={handleDislike} aria-label="add to favorites">
                        <FavoriteIcon style={{ color: '#e53935' }}/>
                        </IconButton>
                        :
                        <IconButton onClick={handleLike} aria-label="add to favorites">
                        <FavoriteIcon />
                        </IconButton>
                        }
                        <Typography variant="body2" color="textSecondary" component="p">{ numeroLikes } Me gusta</Typography>
                        <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                        >
                        <ExpandMoreIcon />
                        </ExpandMore>
                    </CardActions>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                        { tipoEvento === 'Procesión' &&
                            <>
                                <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                    Descripción: { ' '}
                                </Typography>
                            
                                    <Typography  >
                                        { evento.descripcion}
                                    </Typography>
                                
                                <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                    Fecha y hora de inicio: { ' '}
                                </Typography>
                            
                                    <Typography  sx={{display:'inline'}}>
                                        { fechaInicio + ' ' + horaInicio}
                                    </Typography>
                                
                                <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                    Fecha y hora de fin: { ' '}
                                    
                                </Typography>
                            
                                    <Typography  sx={{display:'inline'}}>
                                        { fechaFin + ' ' + horaFin }
                                    </Typography>
                                
                                <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                    Lugar: { ' '}
                                    
                                </Typography>
                            
                                    <Typography  sx={{display:'inline'}}>
                                        { evento.lugar}
                                    </Typography>
                                
                                <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                    Localidad: { ' '}
                                    
                                </Typography>
                            
                                    <Typography  sx={{display:'inline'}}>
                                        { evento.localidad}
                                    </Typography>
                                
                                <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                    Provincia: { ' '}
                                    
                                </Typography>
                            
                                    <Typography  sx={{display:'inline'}}>
                                        { evento.provincia}
                                    </Typography>
                            
                                { esDirectivo &&
                                <>
                                    <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                        Costes: { ' '}
                                        
                                    </Typography>
                                
                                        <Typography  sx={{display:'inline'}}>
                                            { evento.costes}€
                                        </Typography>
                                    
                                    <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                        Beneficios: { ' '}
                                        
                                    </Typography>
                                
                                        <Typography  sx={{display:'inline'}}>
                                            { evento.beneficios}€
                                        </Typography>
                                        
                                    <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                        Comentario económico: { ' '}
                                        
                                    </Typography>
                    
                                        <Typography  sx={{display:'inline'}}>
                                            { evento.comentarioEconomico ? evento.comentarioEconomico : 'No hay comentario económico'}
                                        </Typography>
                            
                                </>
                                }
                                <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                    Tipo de procesión: { ' '}
                                    
                                </Typography>
                                
                                    <Typography  sx={{display:'inline'}}>
                                        { evento.tipo}
                                    </Typography>
                                    
                                { evento.tipo === 'Semana Santa' &&
                                <>
                                <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                    Día de la semana santa: { ' '}
                                    
                                </Typography>
                            
                                <Typography  sx={{display:'inline'}}>
                                    { evento.dia}
                                </Typography>
                                </>
                                }
                                { perteneceUsuarioBanda &&
                                <>
                                    <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                        Fecha y hora de salida de la banda: { ' '}
                                        
                                    </Typography>
                                
                                        <Typography  sx={{display:'inline'}}>
                                            { fechaSalida + ' ' + horaSalida}
                                        </Typography>
                                    
                                    <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                        Lugar de salida de la banda: { ' '}
                                        
                                    </Typography>
                            
                                        <Typography  sx={{display:'inline'}}>
                                            { evento.lugarSalida }
                                        </Typography>
                            
                                    <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                        Bocadillo: { ' '}
                                        
                                    </Typography>
                            
                                        <Typography  sx={{display:'inline'}}>
                                            { evento.bocadillo ? 'Sí' : 'No' } 
                                        </Typography>
                                
                                </>
                                }
                                <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                    Nombre de la hermandad: { ' '}
                                    
                                </Typography>
                                
                                    <Typography  sx={{display:'inline'}}>
                                        { evento.hermandad}
                                    </Typography>
                                
                                <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                    Nombre del titular: { ' '}
                                    
                                </Typography>
                            
                                    <Typography  sx={{display:'inline'}}>
                                        { evento.nombreTitular}
                                    </Typography>
                                
                            </>
                        }
                        {
                            tipoEvento === 'Actuación' &&
                        <>      
                                <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                    Tipo de actuación: { ' '}
                                    
                                </Typography>
                                
                                    <Typography  sx={{display:'inline'}}>
                                        { evento.tipoActuacion}
                                    </Typography>
                                
                                <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                    Descripción: { ' '}
                                    
                                </Typography>
                            
                                    <Typography  sx={{display:'inline'}}>
                                        { evento.descripcion? evento.descripcion : 'No hay ninguna descripción...'}
                                    </Typography>
                                
                                <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                    Fecha y hora de inicio: { ' '}
                                    
                                </Typography>
                                
                                    <Typography  sx={{display:'inline'}}>
                                        { fechaInicio + ' ' + horaInicio}
                                    </Typography>
                                
                                <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                    Fecha y hora de fin: { ' '}
                                    
                                </Typography>
                                
                                    <Typography  sx={{display:'inline'}}>
                                        { fechaFin + ' ' + horaFin }
                                    </Typography>
                                
                                <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                    Lugar: { ' '}
                                    
                                </Typography>
                            
                                    <Typography  sx={{display:'inline'}}>
                                        { evento.lugar}
                                    </Typography>
                                
                                <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                    Localidad: { ' '}
                                    
                                </Typography>
                            
                                    <Typography  sx={{display:'inline'}}>
                                        { evento.localidad}
                                    </Typography>
                            
                                <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                    Provincia: { ' '}
                                    
                                </Typography>
                            
                                    <Typography  sx={{display:'inline'}}>
                                        { evento.provincia}
                                    </Typography>
                                    
                                { esDirectivo &&
                                <>
                                    <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                        Costes: { ' '}
                                        
                                    </Typography>
                                
                                        <Typography  sx={{display:'inline'}}>
                                            { evento.costes}€
                                        </Typography>
                                        
                                    <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                        Beneficios: { ' '}
                                        
                                    </Typography>
                                
                                        <Typography  sx={{display:'inline'}}>
                                            { evento.beneficios}€
                                        </Typography>
                                    
                                    <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                        Comentario económico: { ' '}
                                        
                                    </Typography>
                                    
                                        <Typography  sx={{display:'inline'}}>
                                            { evento.comentarioEconomico ? evento.comentarioEconomico : 'No hay ningún comentario económico...'}
                                        </Typography>
                                    
                                </>
                                }
                                { perteneceUsuarioBanda &&
                                <>
                                    <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                        Fecha y hora de salida de la banda: { ' '}
                                        
                                    </Typography>
                                    
                                        <Typography  sx={{display:'inline'}}>
                                            { fechaSalida + ' ' + horaSalida}
                                        </Typography>
                                    
                                    <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                        Lugar de salida de la banda: { ' '}
                                        
                                    </Typography>
                                
                                        <Typography  sx={{display:'inline'}}>
                                            { evento.lugarSalida }
                                        </Typography>
                                    
                                </>
                                }
                            </>
                        }
                        {
                            tipoEvento === 'Ensayo' && perteneceUsuarioBanda &&
                            <>
                                <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                    Descripción: { ' '}
                                    
                                </Typography>
                                
                                    <Typography  sx={{display:'inline'}}>
                                        { evento.descripcion}
                                    </Typography>
                                
                                <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                    Fecha y hora de inicio: { ' '}
                                    
                                </Typography>
                            
                                    <Typography  sx={{display:'inline'}}>
                                        { fechaInicio + ' ' + horaInicio}
                                    </Typography>
                                
                                <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                    Fecha y hora de fin: { ' '}
                                    
                                </Typography>
                            
                                    <Typography  sx={{display:'inline'}}>
                                        { fechaFin + ' ' + horaFin }
                                    </Typography>
                                
                                <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                    Lugar: { ' '}
                                    
                                </Typography>
                                
                                    <Typography  sx={{display:'inline'}}>
                                        { evento.lugar}
                                    </Typography>
                                
                                <Typography variant="body1" fontWeight={'bold'  } color="text.primary">
                                    Temática: { ' '}
                                    
                                </Typography>
                            
                                    <Typography  sx={{display:'inline'}}>
                                        { evento.tematica}
                                    </Typography>
                                    
                            </>
                        }
                        </CardContent>
                    </Collapse>
                </Card>
            </ListItemButton>
        </ListItem>
        </>
  )
    } else{
        return (
        <>
      
          <Box sx={{ display: 'flex', justifyContent:"center", alignItems:"center"}}>
              <CircularProgress />
          </Box>
      
        </>)
    }
}