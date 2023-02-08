import {Typography, Button, Grid, Link } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AuthLayout } from '../../../auth/layout/AuthLayout';

export class CrearBandaTres extends Component {


    retroceder = e => {
        e.preventDefault();
        this.props.retroceder();
    }

    confirmar = e => {
      e.preventDefault();
      this.props.confirmar(e);
  }

  

    

  render() {
    const { values: {  nombre, tipo, localidad, provincia, codigo_postal,
        direccion, año_fundacion, descripcion, telefono, correo, cif}, titulo} = this.props;

    
    return (
        <AuthLayout  title={titulo} >
        <form>
          <Grid container>
  
            <Grid item xs={ 6 } sx={{ mt: 2}}>
                
                <List dense={true}>
                
                    <ListItem>
                    <ListItemText
                        primary="Nombre:"
                        secondary={<Typography sx = {{ color: 'white'}}>{nombre}</Typography>}
                        sx={{ color:'white'}}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Tipo:"
                        secondary={<Typography sx = {{ color: 'white'}}>{tipo}</Typography>}
                        sx={{ color:'white'}}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Dirección:"
                        secondary={<Typography sx = {{ color: 'white'}}>{direccion}</Typography>}
                        sx={{ color:'white'}}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Año de funcionación:"
                        secondary={<Typography sx = {{ color: 'white'}}>{año_fundacion}</Typography>}
                        sx={{ color:'white'}}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Teléfono:"
                        aria-label='telefono'
                        secondary={<Typography sx = {{ color: 'white'}}>{telefono}</Typography>}
                        sx={{ color:'white'}}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Correo electrónico:"
                        secondary={<Typography sx = {{ color: 'white'}}>{correo}</Typography>}
                        sx={{ color:'white'}}
                    />
                    </ListItem>
                    
                
                </List>
            </Grid>

            <Grid item xs={ 6 } sx={{ mt: 2}}>
                
                <List dense={true}>
                    <ListItem>
                    <ListItemText
                        primary="Localidad:"
                        secondary={<Typography sx = {{ color: 'white'}}>{localidad}</Typography>}
                        sx={{ color:'white'}}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Provincia:"
                        secondary={<Typography sx = {{ color: 'white'}}>{provincia}</Typography>}
                        sx={{ color:'white'}}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Código postal:"
                        secondary={<Typography sx = {{ color: 'white'}}>{codigo_postal}</Typography>}
                        sx={{ color:'white'}}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Dirección:"
                        secondary={<Typography sx = {{ color: 'white'}}>{direccion}</Typography>}
                        sx={{ color:'white'}}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="CIF:"
                        secondary={<Typography sx = {{ color: 'white'}}>{cif}</Typography>}
                        sx={{ color:'white'}}
                    />
                    </ListItem>
                
                </List>
            </Grid>

            
            
            <Grid container justifyContent='center' spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
                <Grid  item xs={ 6 } >
                  <Button  variant='contained' color="secondary" fullWidth onClick={this.retroceder}>
                    Retroceder
                  </Button>
                </Grid>
                <Grid  item xs={ 6 } >
                  <Button  variant='contained' color="secondary" fullWidth onClick={this.confirmar}>
                    Finalizar
                  </Button>
                </Grid>
            </Grid>
  
          </Grid>
        </form>
      </AuthLayout>
    )
  }
}

export default CrearBandaTres