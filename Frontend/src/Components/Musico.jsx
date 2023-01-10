
import { Grid, Paper, Typography } from '@mui/material'
import Avatar from '@material-ui/core/Avatar';
import React from 'react'
import { Box } from '@mui/system';
import {
  BrowserRouter as Router,
  Link,
  NavLink,
}  from "react-router-dom";

export const Musico = ({musico, usuario}) => {
  return (
      <Grid
      xs={4}
      item>
        <NavLink style={{textDecoration: "none", color: "black"}}  to={`/perfil/${usuario._id}`}>
          <Paper elevation={ 3 }   sx={{ vh:'100vh', mb:'10px'}}>
            <Box style={{display: 'inline-block'}}>
              <Avatar   style={{ height: '40px', width: '40px' }}  alt="Remy Sharp" src="/static/images/avatar/1.jpg"  />
            </Box>
            <Box style={{display: 'inline-block'}}>
              <Typography sx={{ml:'10px'}}>{usuario.nombre } { usuario.primer_apellido} { usuario.segundo_apellido }</Typography>
            </Box>
          </Paper>
        </NavLink>
      </Grid>
  )
}
