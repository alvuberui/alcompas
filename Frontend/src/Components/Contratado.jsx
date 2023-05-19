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
import { useAuthStore, useContratadosStore, useUploadsStore } from '../hooks';
import {
    NavLink, useParams
} from "react-router-dom";
import Button from '@mui/material/Button';


export const Contratado = ({musico}) => {

    const [usuario, setUsuario] = useState('');
    const [foto, setFoto] = useState('');

    const {tipoEvento} = useParams();
    const {eventoId} = useParams();

    const { getUserByiD, user } = useAuthStore();
    const { getFotoPerfilUsuario } = useUploadsStore();
    const { crearContratados, errores } = useContratadosStore();

    useEffect(() => {
        const getUsuario = async () => {
            const u = await getUserByiD(musico.usuario);
            setUsuario(u);
        }
        getUsuario();
    }, [musico]);

    useEffect(() => {
        const getFoto = async () => {
            const f = await getFotoPerfilUsuario(musico.usuario);
            setFoto(f);
        }
        getFoto();
    }, [musico]);


    const handleContratar = async() => {
        Swal.fire({
            title: '¿Estás seguro contratar a este músico para el evento?',
            text: "Se añadirá a la asistencia del evento",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, contratar'
            }).then( async(result) => {
            if (result.isConfirmed) {
                const contratado = {'tipo': tipoEvento === 'Procesión' ? 'Procesión' : tipoEvento === 'Actuación'? 'Actuacion' : 'Ensayo', 
                                    'referencia': eventoId, 'usuario': musico.usuario, 'instrumento': musico.instrumento}
                const b = await crearContratados(contratado);
                
                if(b) {
                    Swal.fire(
                    'Contratado!',
                    'El músico ha sido contratado para el evento.',
                    'success'
                    )
                }
            }
        })
    }
    return (
        <Card  style={{marginTop: '5px', width: '100%'}}>
            <CardHeader
                avatar={
                <NavLink to={`/perfil/${musico.usuario}`}>
                <Avatar aria-label="recipe" src={`data:image/png;base64,${foto}`} >
                    
                </Avatar>
                </NavLink>
                }
                title={ usuario.nombre + " " + usuario.primer_apellido + " " + usuario.segundo_apellido + ": " + musico.instrumento }
                subheader={ usuario.localidad + ' ' + (usuario.provincia)}
            />
            <CardActions disableSpacing>
         
                <Button variant="contained" onClick={handleContratar} color="primary" >Contratar</Button>
            
              
                
            </CardActions>
            </Card>
    );
}
