import React, { Component } from 'react'
import { AuthLayout } from '../layout/AuthLayout';
import { Grid, Button, Link } from '@mui/material';
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
  
            <Grid item xs={ 6 } sx={{ mt: 2}}>
                
                <List dense={true}>
                
                    <ListItem>
                    <ListItemText
                        primary="Nombre:"
                        secondary={nombre}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Primer Apellido:"
                        secondary={primer_apellido}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Segundo Apellido:"
                        secondary={segundo_apellido}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Correo:"
                        secondary={correo}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Nif:"
                        secondary={nif}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Teléfono:"
                        secondary={telefono}
                    />
                    </ListItem>
                    
                
                </List>
            </Grid>

            <Grid item xs={ 6 } sx={{ mt: 2}}>
                
                <List dense={true}>
                    <ListItem>
                    <ListItemText
                        primary="Fecha Nacimiento:"
                        secondary={fecha_nacimiento}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Localidad:"
                        secondary={localidad}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Provincia:"
                        secondary={provincia}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Código postal:"
                        secondary={codigo_postal}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Dirección:"
                        secondary={direccion}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Usuario:"
                        secondary={usuario}
                    />
                    </ListItem>
                
                </List>
            </Grid>

            
            
            <Grid container justifyContent='center' spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
                <Grid  item xs={ 6 } >
                  <Button  variant='contained' fullWidth onClick={this.retroceder}>
                    Retroceder
                  </Button>
                </Grid>
                <Grid  item xs={ 6 } >
                  <Button  variant='contained' fullWidth onClick={this.confirmar}>
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