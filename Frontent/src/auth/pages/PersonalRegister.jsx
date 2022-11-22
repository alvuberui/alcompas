import React, { Component } from 'react'
import { AuthLayout } from '../layout/AuthLayout';
import { Grid, TextField, Button, Link } from '@mui/material';
import { Link as RouterLink} from 'react-router-dom';

export class PersonalRegister extends Component {ç
    continuar = e => {
        e.preventDefault();
        this.props.siguiente()
    }
  render() {
    const { values, handleChange, titulo } = this.props;
    
    return (
        <AuthLayout  title={titulo} >
        <form>
          <Grid container>
  
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField 
                label="Nombre"
                type="text"
                placeholder="Nombre"
                fullWidth
                onChange={handleChange('nombre')}
                defaultValue={values.nombre}

              />
            </Grid>
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField 
                label="Primer apellido"
                type="text"
                placeholder="Apellido 1"
                fullWidth
                onChange={handleChange('primer_apellido')}
                defaultValue={values.primer_apellido}
              />
            </Grid>
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField 
                label="Segundo Apellido"
                type="text"
                placeholder="Apellido 2"
                fullWidth
                onChange={handleChange('segundo_apellido')}
                defaultValue={values.segundo_apellido}
              />
            </Grid>
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField 
                label="DNI"
                type="text"
                placeholder="DNI"
                fullWidth
                onChange={handleChange('nif')}
                defaultValue={values.nif}
              />
            </Grid>
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField
                label="Fecha nacimiento"
                type="date"
                fullWidth
                InputLabelProps={{
                shrink: true,
                }}
                onChange={handleChange('fecha_nacimiento')}
                
                defaultValue={values.fecha_nacimiento}
                
              />
            </Grid>
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField
                label="Correo electrónico"
                type="email"
                placeholder="correo@gmail.com"
                fullWidth
                onChange={handleChange('correo')}
                defaultValue={values.correo}
              />
            </Grid>
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField
                label="Teléfono"
                type="tel"
                placeholder="666666666"
                fullWidth
                onChange={handleChange('telefono')}
                defaultValue={values.telefono}
              />
            </Grid>
            
              <Grid container justifyContent='center' spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
                <Grid  item xs={ 6 } >
                  <Button  variant='contained' fullWidth onClick={this.continuar}>
                    Siguiente
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

export default PersonalRegister