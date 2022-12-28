import React, { Component } from 'react'
import { AuthLayout } from '../../../auth/layout/AuthLayout';
import { Grid, Button, Link } from '@mui/material';
import { Link as RouterLink} from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

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
                        secondary={nombre}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Tipo:"
                        secondary={tipo}
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
                        primary="Año de funcionación:"
                        secondary={año_fundacion}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Teléfono:"
                        secondary={telefono}
                    />
                    </ListItem>
                    <ListItem>
                    <ListItemText
                        primary="Correo electrónico:"
                        secondary={correo}
                    />
                    </ListItem>
                    
                
                </List>
            </Grid>

            <Grid item xs={ 6 } sx={{ mt: 2}}>
                
                <List dense={true}>
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
                        primary="CIF:"
                        secondary={cif}
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
            <Grid container direction='row' justifyContent='end'>
              <Link component={ RouterLink }color='inherit' to="/auth/login">
                Iniciar sesión
              </Link>
            </Grid>
  
          </Grid>
        </form>
      </AuthLayout>
    )
  }
}

export default CrearBandaTres