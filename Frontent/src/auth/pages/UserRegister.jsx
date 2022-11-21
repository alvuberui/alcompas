import React, { Component } from 'react'
import { AuthLayout } from '../layout/AuthLayout';
import { Grid, TextField, Button, Link } from '@mui/material';
import { Link as RouterLink} from 'react-router-dom';

export class UserRegister extends Component {
    continuar = e => {
        e.preventDefault();
        this.props.siguiente();
    }

    retroceder = e => {
        e.preventDefault();
        this.props.retroceder();
    }

  render() {
    const { values, handleChange } = this.props;
    return (
        <AuthLayout  title="Crear cuenta" >
        <form>
          <Grid container>
  
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField 
                label="Usuario"
                type="text"
                placeholder="Usuario"
                fullWidth
                onChange={handleChange('usuario')}
                defaultValue={values.usuario}
                
              />
            </Grid>
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField 
                label="Contraseña"
                type="password"
                placeholder="Contraseña"
                defaultValue={values.contraseña}
                fullWidth
                onChange={handleChange('contraseña')}
              />
            </Grid>
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField 
                label="Confirmar contraseña"
                type="password"
                placeholder="Confirmar contraseña"
                defaultValue={values.confirmacion_contraseña}
                fullWidth
                onChange={handleChange('confirmacion_contraseña')}
              />
            </Grid>
            <Grid item xs={ 12 } sx={{ mt: 2} }>
              <TextField 
                label="Descripción"
                type="text"
                placeholder="Descripción"
                fullWidth
                onChange={handleChange('descripcion')}
                defaultValue={values.descripcion}
                rows={10}
                multiline
              />
            </Grid>
              <Grid container justifyContent='center' spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
                <Grid  item xs={ 6 } >
                  <Button  variant='contained' fullWidth onClick={this.retroceder}>
                    Retroceder
                  </Button>
                </Grid>
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

export default UserRegister