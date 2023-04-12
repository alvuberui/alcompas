import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { ListItem, Box, ListItemButton } from '@mui/material';
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
import { useAnunciosStore, useAuthStore, useBandasStore, useDirectivosStore, useUploadsStore } from '../hooks';

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

export const Evento = ({ evento, index, style }) => {

    // Estados
    const [expanded, setExpanded] = useState(false);
    const [banda, setBanda] = useState({});
    const [fotoPerfil, setFotoPerfil] = useState('');
    const [ esDirectivo, setEsDirectivo ] = useState(false);
    const [ tipoEvento, setTipoEvento ] = useState('');
    const [ pertenece, setPertenece ] = useState(false);
    const horaSalida  = new Date(evento.fechaSalida).getHours() + ":" + new Date(evento.fechaSalida).getMinutes();
    const fechaSalida = new Date(evento.fechaSalida).toLocaleDateString();
    const horaInicio = new Date(evento.fechaInicio).getHours() + ":" + new Date(evento.fechaInicio).getMinutes();
    const fechaInicio = new Date(evento.fechaInicio).toLocaleDateString();
    const horaFin  = new Date(evento.fechaFin).getHours() + ":" + new Date(evento.fechaFin).getMinutes();
    const fechaFin = new Date(evento.fechaFin).toLocaleDateString();


    // Hooks
    const { getBandaById, perteneceUsuarioBanda } = useBandasStore();
    const { getFotoPerfilBanda } = useUploadsStore();
    const { user } = useAuthStore();
    const { getDirectivoByUserId } = useDirectivosStore();



    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        const getBanda = async () => {
            const bandareq = await getBandaById(evento.banda);
            bandareq.titulo = bandareq.tipo + " " + bandareq.nombre;
            setBanda(bandareq);
        }
        const getFoto = async () => {
            const fotoreq = await getFotoPerfilBanda(evento.banda);
            setFotoPerfil(fotoreq);
        }
        getFoto();
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

            const pertenece = await perteneceUsuarioBanda(user.uid, banda._id);
            setPertenece(pertenece);
        }
        esDirectivo();
        perteneceUsuarioBandaF();
    }, [banda, user]);

    const handleDelete = async () => {
        Swal
            .fire({
                title: "¿Está seguro de que desea eliminar su noticia?",
                text: "Esta acción será irreversible",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            })
            .then(async resultado => {
                if (resultado.value) {
                    const noticiaDelete = await deleteNoticia(noticia._id);
                    // Eliminar noticia en setNoticias
                    setNoticias( noticias => noticias.filter( not => not._id !== noticiaDelete._id ) );
                }
            });
    }

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
        <ListItemButton>
            <Card sx={{ width: '100%' }}>
                <CardHeader
                    avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" src={`data:image/png;base64,${fotoPerfil}`}>
                        
                    </Avatar>
                    }
                    action={
                        esDirectivo &&
                    <IconButton onClick={ handleDelete } aria-label="settings">
                        <DeleteIcon />
                    </IconButton>
                    }
                    title= {banda.titulo}
                />
                <CardContent>
                    <Typography variant="body1" fontWeight={'bold'  } textTransform={'uppercase'} color="text.primary">
                    {tipoEvento} - {evento.titulo}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                    </IconButton>
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
                                        { evento.comentarioEconomico}
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
                                Descripción: { ' '}
                                
                            </Typography>
                            
                                <Typography  sx={{display:'inline'}}>
                                     { evento.tipoActuacion}
                                </Typography>
                               
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
                                        { evento.comentarioEconomico}
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
  )
}