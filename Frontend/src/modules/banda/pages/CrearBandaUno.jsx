import React, { Component } from 'react'
import { AuthLayout } from '../../../auth/layout/AuthLayout';
import { Grid, TextField, Button, Link, Select, MenuItem } from '@mui/material';
import { Link as RouterLink} from 'react-router-dom';

export class CrearBandaUno extends Component {
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
                label="Nombre de banda"
                type="text"
                placeholder="Nombre de banda"
                fullWidth
                onChange={handleChange('nombre')}
                defaultValue={values.nombre}

              />
            </Grid>
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                fullWidth
                defaultValue={values.tipo?values.tipo:'Agrupación Musical'}
                label="Tipo"
                onChange={handleChange('tipo')}
              >
                <MenuItem value={'Agrupación Musical'}>Agrupación Musical</MenuItem>
                <MenuItem value={'Banda de Cornetas y Tambores'}>Banda de Cornetas y Tambores</MenuItem>
                <MenuItem value={'Banda de Música'}>Banda de Música</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField 
                label="Año fundación"
                type="number"
                placeholder="Año fundación"
                fullWidth
                onChange={handleChange('año_fundacion')}
                defaultValue={values.año_fundacion}
              />
            </Grid>
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField 
                label="CIF"
                type="text"
                placeholder="CIF"
                fullWidth
                onChange={handleChange('cif')}
                defaultValue={values.cif}
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
