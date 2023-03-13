import { ListItem, ListItemButton, ListItemText }from '@mui/material';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';   
import { useAuthStore, useBandasStore, useUploadsStore } from '../hooks';

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

export const Noticia = ({ noticia, index, style }) => {

    // Estados
    const [expanded, setExpanded] = useState(false);
    const [banda, setBanda] = useState({});
    const [fotoPerfil, setFotoPerfil] = useState('');
    const horas  = new Date(noticia.fecha).getHours() + ":" + new Date(noticia.fecha).getMinutes();
    const fecha = new Date(noticia.fecha).toLocaleDateString();


    // Hooks
    const { getBandaById } = useBandasStore();
    const { getFotoPerfilBanda } = useUploadsStore();
    const { user } = useAuthStore();

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
                    <IconButton aria-label="settings">
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
