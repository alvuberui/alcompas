
import { useEffect, useState } from 'react';
import {
    NavLink
} from "react-router-dom";

import { useAuthStore, useComentariosStore, useLikesStore, useUploadsStore } from '../hooks';

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



export const Repertorio = ({ repertorio, eliminar }) => {

    const handleElminar = e => {
        e.preventDefault();
        Swal
        .fire({
            title: "¿Está seguro de que desea eliminar su comentario?",
            text: "Esta acción será irreversible y no podrá recuperarlo",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        })
        .then(async resultado => {
            if (resultado.value) {
                // Hicieron click en "Sí"
                const c = await eliminarComentario(comentario._id);
                eliminar(comentario._id);
            }
        });
    }


  return (
            <Card  style={{marginTop: '5px', width: '95%'}}>
                <CardHeader
                    action={
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