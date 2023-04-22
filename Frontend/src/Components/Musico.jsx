
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid, Paper, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import React, { useState } from 'react';
import {
  useNavigate,
  NavLink, useParams
} from "react-router-dom";
import { useDirectivosStore } from '../hooks/useDirectivosStore';
import { useMusicosStore } from '../hooks/useMusicosStore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { VerMotivo } from '../modules/eventos';
import { useContratadosStore } from '../hooks';
import Swal from 'sweetalert2';

export const Musico = ({ usuario, tipo, directivo, asistencia, contratado, contratadoId}) => {
  
  const { bandaId } = useParams();
  const [ open , setOpen ] = useState(false);
  const { finalizarMusico } = useMusicosStore();
  const { finalizarDirectivo, getDirectivosByBandaId } = useDirectivosStore();
  const { deleteContratado } = useContratadosStore();
  const navigate = useNavigate();

  const handleEliminarMusico = (e) => {
    e.preventDefault();
    finalizarMusico(usuario._id, bandaId);
  }

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleEliminarDirectivo = async(e) => {
    e.preventDefault();
    const directivos = await getDirectivosByBandaId(bandaId);
    const keys = Object.keys(directivos);
    let contador = 0;
    for( const key of keys) {
      contador += directivos[key].length;
    }
    if(contador === 1){
      navigate('/');
      finalizarDirectivo(usuario._id, bandaId);
    }
    else {
      finalizarDirectivo(usuario._id, bandaId);
    } 
  }

  const handleEliminarContratado = (e) => {
    e.preventDefault();
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Se eliminará el músico contratado para esta actuación",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteContratado(contratadoId);
        Swal.fire(
          'Eliminado',
          'El músico contratado ha sido eliminado',
          'success'
        )
      }
    })
  }


  return (
    <>
      { asistencia &&
      <VerMotivo open={open} handleClose={handleClose} motivo={asistencia.comentario}></VerMotivo>
      }
      <Grid
      xs={4}
      item>
        
          <Paper elevation={ 3 }   sx={{ vh:'100vh', mb:'10px'}}>
            <Grid container>
              <Grid item xs={12} lg={11} alignContent={'center'} justifyContent={'center'}>
              <NavLink style={{textDecoration: "none", color: "black"}}  to={`/perfil/${usuario._id}`}>
                <Typography sx={{ml:'10px', mt:'10px', textAlign:'center'}}>{usuario.nombre } { usuario.primer_apellido} { usuario.segundo_apellido }</Typography>
              </NavLink>
              </Grid>
              { directivo && 
                <Grid item xs={12} lg={1} alignContent={'center'} justifyContent={'center'} display='flex'>
                  { tipo === 'musico' ?
                    
                    <IconButton role={"eliminar"} onClick={ handleEliminarMusico } sx = {{alignSelf:'flex-end'}} color="error" aria-label="upload picture" component="label">
                      <DeleteIcon  ></DeleteIcon>
                    </IconButton>
                    :
                    <IconButton  onClick={ handleEliminarDirectivo  } sx = {{alignSelf:'flex-end'}} color="error" aria-label="upload picture" component="label">
                      <DeleteIcon  ></DeleteIcon>
                    </IconButton>
                  }
                </Grid>
              }
              { contratado && 
                <Grid item xs={12} lg={1} alignContent={'center'} justifyContent={'center'} display='flex'>
                    <IconButton  onClick={ handleEliminarContratado } sx = {{alignSelf:'flex-end'}}  aria-label="upload picture" component="label">
                      <DeleteIcon style={{color:'#FF0000'}} ></DeleteIcon>
                    </IconButton>
                </Grid>
              }
              {
                asistencia !== undefined &&
                <Grid item xs={12} lg={1} alignContent={'right'} justifyContent={'right'} display='flex'>
                  { asistencia !== null && asistencia !== undefined &&
                    <IconButton  onClick={ handleOpen } sx = {{alignSelf:'flex-end'}}  aria-label="upload picture" component="label">
                      <VisibilityIcon  ></VisibilityIcon>
                    </IconButton>
                  }
                  {
                    asistencia !== null && asistencia !== undefined && asistencia.respuesta === 'Asisto' ?
                    <IconButton  sx = {{alignSelf:'flex-end'}}  aria-label="upload picture" component="label">
                      <DoneIcon style={{color:'green'}} ></DoneIcon>
                    </IconButton>
                    :
                    asistencia !== null && asistencia !== undefined && asistencia.respuesta === 'No asisto' ?
                    <IconButton sx = {{alignSelf:'flex-end'}}  aria-label="upload picture" component="label">
                      <ClearIcon color='error' ></ClearIcon>
                    </IconButton>
                    : 
                    <></>
                  }
                  {
                    asistencia === null &&
                    <IconButton sx = {{alignSelf:'flex-end'}}   aria-label="upload picture" component="label">
                      <QuestionMarkIcon  ></QuestionMarkIcon>
                    </IconButton>
                  }
                </Grid>
              }
            </Grid>
          </Paper>
      </Grid>
    </>
  )
}
