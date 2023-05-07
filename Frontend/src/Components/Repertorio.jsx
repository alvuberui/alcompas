
import { useEffect, useState } from 'react';
import {
    NavLink
} from "react-router-dom";

import { useArchiverosStore, useAuthStore, useComentariosStore, useLikesStore, useObrasStore, useRepertoriosStore, useUploadsStore } from '../hooks';

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
import Swal from 'sweetalert2';



export const Repertorio = ({ repertorio, eliminar, esArchivero, setObras, setRepertorio}) => {

    const { eliminarRepertorio } = useRepertoriosStore();
    const { getAllObrasByRepertorioId } = useObrasStore();

    const [hovered, setHovered] = useState(false);

    const handleObras = async () => {
        const obras = await getAllObrasByRepertorioId(repertorio._id);
        setRepertorio(repertorio);
        setObras(obras);
    }

    const handleMouseOver = () => {
        setHovered(true);
      };
    
      const handleMouseOut = () => {
        setHovered(false);
      };

    const handleElminar = e => {
        e.preventDefault();
        Swal
        .fire({
            title: "¿Está seguro de que desea eliminar el repertorio?",
            text: "Esta acción será irreversible y no podrá recuperarlo",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        })
        .then(async resultado => {
            if (resultado.value) {
                // Hicieron click en "Sí"
                const c = await eliminarRepertorio(repertorio._id);
                if (c) {
                    eliminar(repertorio._id);
                    Swal.fire({
                        title: "Repertorio eliminado",
                        text: "El repertorio ha sido eliminado correctamente",
                        icon: 'success',
                        confirmButtonText: "Aceptar",
                    });
                }
            }
        });
    }


  return (
            <Card  onClick={handleObras} onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut} 
                style={{
                marginTop: '5px',
                width: '95%',
                backgroundColor: hovered ? '#F5F5F5' : 'white',
                transition: 'background-color 0.3s ease-out'
              }}>
                <CardHeader
                    action={
                    esArchivero &&
                    <IconButton onClick={handleElminar} aria-label="settings">
                        <DeleteIcon />
                    </IconButton>
                    }
                    title={repertorio.titulo}
                />
                {
                    repertorio.descripcion &&
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                        {repertorio.descripcion}
                        </Typography>
                    </CardContent>
                }
                </Card>
    );
}