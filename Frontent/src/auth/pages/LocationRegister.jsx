import React, { Component } from 'react'
import { AuthLayout } from '../layout/AuthLayout';
import { Grid, TextField, Button, Link } from '@mui/material';
import { Link as RouterLink} from 'react-router-dom';

export class LocationRegister extends Component {
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
                label="Localidad"
                type="text"
                placeholder="Localidad"
                fullWidth
                onChange={handleChange('localidad')}
                defaultValue={values.localidad}
              />
            </Grid>
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField 
                label="Provincia"
                type="text"
                placeholder="Provincia"
                fullWidth
                onChange={handleChange('provincia')}
                defaultValue={values.provincia}
              />
            </Grid>
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField 
                label="Código postal"
                type="text"
                placeholder="Código postal"
                fullWidth
                onChange={handleChange('codigo_postal')}
                defaultValue={values.codigo_postal}
              />
            </Grid>
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField 
                label="Direccion"
                type="text"
                placeholder="Direccion"
                fullWidth
                onChange={handleChange('direccion')}
                defaultValue={values.direccion}
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
   
  
          </Grid>
        </form>
      </AuthLayout>
    )
  }
}

export default LocationRegister