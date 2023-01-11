
import { Grid, Paper, Typography } from '@mui/material'
import Avatar from '@material-ui/core/Avatar';
import React from 'react'
import { Box } from '@mui/system';
import {
  BrowserRouter as Router,
  Link,
  NavLink,
}  from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from "@mui/material/colors";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useParams } from 'react-router-dom';
import { useMusicosStore } from '../hooks/useMusicosStore';

export const Musico = ({musico, usuario}) => {

  const { bandaId } = useParams();
  const { finalizarMusico } = useMusicosStore();
  
  const handleEliminarMusico = (e) => {
    e.preventDefault();
    musico = finalizarMusico(usuario._id, bandaId);
  }

  return (
      <Grid
      xs={4}
      item>
        <NavLink style={{textDecoration: "none", color: "black"}}  to={`/perfil/${usuario._id}`}>
          <Paper elevation={ 3 }   sx={{ vh:'100vh', mb:'10px'}}>
            <Grid container>
              <Grid item xs={12} lg={1.5} alignContent={'center'}  justifyContent={'center'} display='flex'>
                <Avatar   style={{ height: '40px', width: '40px' }}  alt="Remy Sharp" src="/static/images/avatar/1.jpg"  />
              </Grid>
              <Grid item xs={12} lg={9.5} alignContent={'center'} justifyContent={'center'}>
                <Typography sx={{ml:'10px', mt:'10px', textAlign:'center'}}>{usuario.nombre } { usuario.primer_apellido} { usuario.segundo_apellido }</Typography>
              </Grid>
              <Grid item xs={12} lg={1} alignContent={'center'} justifyContent={'center'} display='flex'>
                <IconButton onClick={ handleEliminarMusico } sx = {{alignSelf:'flex-end'}} color="error" aria-label="upload picture" component="label">
                  <DeleteIcon  ></DeleteIcon>
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        </NavLink>
      </Grid>
  )
}
