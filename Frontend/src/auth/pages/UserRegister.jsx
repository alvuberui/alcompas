import { Button, Grid, TextField } from '@mui/material';
import React, { Component } from 'react';
import { AuthLayout } from '../layout/AuthLayout';

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
    const { values, handleChange, titulo } = this.props;
    return (
        <AuthLayout  title={titulo} >
        <form>
          <Grid container>
  
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField 
                label="Usuario"
                type="text"
                placeholder="Usuario"
                fullWidth
                color='secondary'
                onChange={handleChange('usuario')}
                defaultValue={values.usuario}
                inputProps={{ style: { color: 'white' } }} 
                style={{borderColor:'white', textDecorationColor:'white'}}
                focused
                
              />
            </Grid>
            { titulo == 'Crear Cuenta' && 
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField 
                label="Contraseña"
                type="password"
                placeholder="Contraseña"
                color='secondary'
                inputProps={{ style: { color: 'white' } }} 
                defaultValue={values.contraseña}
                fullWidth
                onChange={handleChange('contraseña')}
                focused
              />
            </Grid>
            }
            { titulo == 'Crear Cuenta' &&
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField 
                label="Confirmar contraseña"
                type="password"
                placeholder="Confirmar contraseña"
                inputProps={{ style: { color: 'white' } }} 
                color='secondary'
                defaultValue={values.confirmacion_contraseña}
                fullWidth
                onChange={handleChange('confirmacion_contraseña')}
                focused
              />
            </Grid>
            }
            <Grid item xs={ 12 } sx={{ mt: 2} }>
              <TextField 
                label="Descripción"
                type="text"
                placeholder="Descripción"
                fullWidth
                color='secondary'
                onChange={handleChange('descripcion')}
                inputProps={{ style: { color: 'white' } }} 
                defaultValue={values.descripcion}
                rows={10}
                multiline
                focused
              />
            </Grid>
              <Grid container justifyContent='center' spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
                <Grid  item xs={ 6 } >
                  <Button  variant='contained' color='secondary'  fullWidth onClick={this.retroceder}>
                    Retroceder
                  </Button>
                </Grid>
                <Grid  item xs={ 6 } >
                  <Button  variant='contained' color='secondary' fullWidth onClick={this.continuar}>
                    Siguiente
                  </Button>
                </Grid>
              </Grid>
 
  
          </Grid>
        </form>
      </AuthLayout>
    )
  }
}

export default UserRegister