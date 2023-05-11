

import { useEffect, useState } from 'react';
import {
    NavLink
} from "react-router-dom";

import { useArchiverosStore, useAuthStore, useComentariosStore, useLikesStore, useObrasStore, usePartiturasStore, useRepertoriosStore, useUploadsStore } from '../hooks';

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

export const Partitura = ({ partitura, eliminar, esArchivero, setPartitura }) => {
 
    const [ hovered, setHovered ] = useState(false);
    const { getPartituraById, eliminarPartitura } = usePartiturasStore();
 
    const handleMouseOver = () => {
      setHovered(true);
    };
  
    const handleMouseOut = () => {
      setHovered(false);
    };

    const handleClick = async(e) => {
      e.preventDefault();
      const p = await getPartituraById(partitura._id);
      setPartitura(p);
    }

    const handleElminar = e => {
      e.preventDefault();
      e.stopPropagation();
      Swal
      .fire({
          title: "¿Está seguro de que desea eliminar la partitura?",
          text: "Esta acción será irreversible y no podrá recuperarla",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
      })
      .then(async resultado => {
          if (resultado.value) {
              // Hicieron click en "Sí"
              const c = await eliminarPartitura(partitura._id);
              if (c) {
                  eliminar(partitura._id);
                  Swal.fire({
                      title: "Partitura eliminada",
                      text: "La partitura ha sido eliminada correctamente",
                      icon: 'success',
                      confirmButtonText: "Aceptar",
                  });
              }
          }
      });
  }

  return (
    <Card onClick={handleClick} onMouseOver={handleMouseOver}
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
                    title={ partitura.instrumento + " " + partitura.voz }
                />
                </Card>
    );
}