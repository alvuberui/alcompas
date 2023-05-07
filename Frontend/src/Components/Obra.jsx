

import { useEffect, useState } from 'react';
import {
    NavLink
} from "react-router-dom";

import { useArchiverosStore, useAuthStore, useComentariosStore, useLikesStore, useObrasStore, useRepertoriosStore, useUploadsStore } from '../hooks';

import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { ListItem, ListItemButton, Box } from '@mui/material';
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
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Chip } from '@material-ui/core';
import FolderIcon from '@mui/icons-material/Folder';

const theme = createTheme({
    components: {
      MuiIcon: {
        styleOverrides: {
          root: {
            // Match 24px = 3 * 2 + 1.125 * 16
            boxSizing: 'content-box',
            padding: 3,
            fontSize: '1.125rem',
          },
        },
      },
    },
  });

export const Obra = ({ obra, eliminar, esArchivero, setPartituras, setObra}) => {

    const { eliminarObra } = useObrasStore();
    const [hovered, setHovered] = useState(false);

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
          title: "¿Está seguro de que desea eliminar la obra?",
          text: "Esta acción será irreversible y no podrá recuperarla",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
      })
      .then(async resultado => {
          if (resultado.value) {
              // Hicieron click en "Sí"
              const c = await eliminarObra(obra._id);
              if (c) {
                  eliminar(obra._id);
                  Swal.fire({
                      title: "Obra eliminada",
                      text: "La obra ha sido eliminada correctamente",
                      icon: 'success',
                      confirmButtonText: "Aceptar",
                  });
              }
          }
      });
  }

  return (
    <Card onMouseOver={handleMouseOver}
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
                    title={obra.titulo + " (" + obra.compositor + ")"}
                />
                </Card>
    );
}
