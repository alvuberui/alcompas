import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { ListItem, ListItemButton } from '@mui/material';
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

export const Noticia = ({ noticia, index, style, setNoticias }) => {

    // Estados
    const [expanded, setExpanded] = useState(false);
    const [banda, setBanda] = useState({});
    const [fotoPerfil, setFotoPerfil] = useState('');
    const [ esDirectivo, setEsDirectivo ] = useState(false);
    const horas  = new Date(noticia.fecha).getHours() + ":" + new Date(noticia.fecha).getMinutes();
    const fecha = new Date(noticia.fecha).toLocaleDateString();


    // Hooks
    const { getBandaById } = useBandasStore();
    const { getFotoPerfilBanda } = useUploadsStore();
    const { user } = useAuthStore();
    const { getDirectivoByUserId } = useDirectivosStore();
    const { deleteNoticia } = useAnunciosStore();

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        const getBanda = async () => {
            const bandareq = await getBandaById(noticia.banda);
            bandareq.titulo = bandareq.tipo + " " + bandareq.nombre;
            setBanda(bandareq);
        }
        const getFoto = async () => {
            const fotoreq = await getFotoPerfilBanda(noticia.banda);
            setFotoPerfil(fotoreq);
        }
        getFoto();
        getBanda();
    }, []);

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
        esDirectivo();
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
                    subheader={fecha + " a las " + horas}
                />
                <CardContent>
                    <Typography variant="body1" fontWeight={'bold'  } textTransform={'uppercase'} color="text.primary">
                    {noticia.titulo}
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
                    <Typography paragraph>
                        {noticia.descripcion}
                    </Typography>
                    </CardContent>
                </Collapse>
            </Card>
        </ListItemButton>
    </ListItem>
  )
}
