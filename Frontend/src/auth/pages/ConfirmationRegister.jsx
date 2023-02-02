import React, { Component } from 'react'
import { AuthLayout } from '../layout/AuthLayout';
import { Grid, Button, Link, Typography } from '@mui/material';
import { Link as RouterLink} from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

export class ConfirmationRegister extends Component {


    retroceder = e => {
        e.preventDefault();
        this.props.retroceder();
    }

    confirmar = e => {
      e.preventDefault();
      this.props.confirmar(e);
  }

  

    

  render() {
    const { values: {  nombre, primer_apellido, segundo_apellido, correo,
        descripcion, localidad, provincia, codigo_postal, direccion,
        nif, telefono, usuario, fecha_nacimiento }, titulo } = this.props;

    
    return (
        <AuthLayout  title={titulo} >
        <form>
          <Grid container>
  
            <Grid  item xs={ 6 } sx={{ mt: 2}}>
                
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
                        primary="Primer Apellido:"
                        secondary={<Typography sx = {{ color: 'white'}}>{primer_apellido}</Typography>}
                        sx={{ color:'white'}}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Segundo Apellido:"
                        secondary={<Typography sx = {{ color: 'white'}}>{segundo_apellido}</Typography>}
                        sx={{ color:'white'}}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Correo:"
                        secondary={<Typography sx = {{ color: 'white'}}>{correo}</Typography>}
                        sx={{ color:'white'}}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Nif:"
                        aria-label='nif'
                        secondary={<Typography sx = {{ color: 'white'}}>{nif}</Typography>}
                        sx={{ color:'white'}}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Teléfono:"
                        secondary={<Typography sx = {{ color: 'white'}}>{telefono}</Typography>}
                        sx={{ color:'white'}}
                    />
                    </ListItem>
                    
                
                </List>
            </Grid>

            <Grid item xs={ 6 } sx={{ mt: 2}}>
                
                <List  dense={true}>
                    <ListItem>
                    <ListItemText
                        primary="Fecha Nacimiento:"
                        secondary={<Typography sx = {{ color: 'white'}}>{fecha_nacimiento}</Typography>}
                        color='white'
                        sx={{ color:'white'}}
                    />
                    </ListItem>
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
                        primary="Usuario:"
                        secondary={<Typography sx = {{ color: 'white'}}>{usuario}</Typography>}
                        
                        style={{ color:'white'}}
                    />
                    </ListItem>
                
                </List>
            </Grid>

            
            
            <Grid container justifyContent='center' spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
                <Grid  item xs={ 6 } >
                  <Button  variant='contained' color='secondary' fullWidth onClick={this.retroceder}>
                    Retroceder
                  </Button>
                </Grid>
                <Grid  item xs={ 6 } >
                  <Button  variant='contained' color='secondary' fullWidth onClick={this.confirmar}>
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

export default ConfirmationRegister