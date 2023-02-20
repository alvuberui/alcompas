import { Button, Grid, Link, TextField } from '@mui/material';
import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AuthLayout } from '../../../auth/layout/AuthLayout';

export class CrearBandaDos extends Component {
    continuar = e => {
        e.preventDefault();
        this.props.siguiente()
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
                color='secondary'
                inputProps={{ style: { color: 'white' } }} 
                focused
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
                color='secondary'
                inputProps={{ style: { color: 'white' } }} 
                focused
              />
            </Grid>
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField 
                label="Código Postal"
                type="text"
                placeholder="Código Postal"
                fullWidth
                aria-label='codigo'
                onChange={handleChange('codigo_postal')}
                defaultValue={values.codigo_postal}
                color='secondary'
                inputProps={{ style: { color: 'white' } }} 
                focused
              />
            </Grid>
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField 
                label="Dirección"
                type="text"
                placeholder="Dirección"
                fullWidth
                onChange={handleChange('direccion')}
                defaultValue={values.direccion}
                color='secondary'
                inputProps={{ style: { color: 'white' } }} 
                focused
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
                color='secondary'
                rows={10}
                multiline
                inputProps={{ style: { color: 'white' } }} 
                focused
              />
            </Grid>
              <Grid container justifyContent='center' spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
              <Grid  item xs={ 6 } >
                  <Button  variant='contained' color='secondary' fullWidth onClick={this.retroceder}>
                    Retroceder
                  </Button>
                </Grid>
                <Grid  item xs={ 6 } >
                  <Button aria-label='link' variant='contained' color='secondary' fullWidth onClick={this.continuar}>
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