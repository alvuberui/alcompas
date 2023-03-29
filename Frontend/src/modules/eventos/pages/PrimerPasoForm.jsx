import { Button, Grid, Link, MenuItem, Select, TextField, IconButton, InputLabel,FormControl } from '@mui/material';
import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AuthLayout } from '../../../auth/layout/AuthLayout';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CalendarToday from '@mui/icons-material/CalendarToday';

export class PrimerPasoForm extends Component {
    continuar = e => {
        e.preventDefault();
        this.props.siguiente()
    }
    
  render() {
    const { values, handleChange, titulo, setValues } = this.props;

    return (
        <AuthLayout  title={titulo} >
        <form>
          <Grid container>
            
          <Grid item xs={12} sx={{ mt: 2 }}>
            <FormControl variant="outlined" fullWidth sx={{ minWidth: 120 }}>
              <InputLabel id="demo-simple-select-standard-label" sx={{ color: 'white !important' }}>Tipo de evento*</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Tipo de evento"
                fullWidth
                value={values.tipoEvento}
                onChange={handleChange('tipoEvento')}
                inputProps={{ style: { color: 'white' } }}
                sx={{
                  '& fieldset': {
                    borderColor: 'white',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white !important',
                  },
                  '& .MuiInputBase-input': {
                    color: '#e2e2e1',
                  },
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'white',
                    },
                  },
                  color: 'white',
                }}
              >
                <MenuItem value={'procesion'}>Procesión</MenuItem>
                <MenuItem value={'actuacion'}>Actuación</MenuItem>
                <MenuItem value={'ensayo'}>Ensayo</MenuItem>
              </Select>
            </FormControl>
          </Grid>


            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField 
                type="text"
                label="Título del evento*"
                placeholder="Título del evento"
                fullWidth
                onChange={handleChange('titulo')}
                defaultValue={values.titulo}
                color='secondary'
                inputProps={{ style: { color: 'white' } }} 
                focused
              />
            </Grid>
            <Grid item xs={ 12 } sx={{ mt: 2} }>
              <TextField 
                type="text"
                label="Descripción del evento"
                placeholder="Descripción del evento"
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
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker 
                disablePast
                focused
                onChange={ value => setValues({ ...values, ["fechaInicio"]: value })}
                value={values.fechaInicio}
                label="Fecha y hora de inicio del evento*"
                error={true}
                sx={{ 
                  color: 'white !important',
                  width: '100%', 
                  '& .MuiInputBase-input': {
                    color: '#e2e2e1',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'white',
                  },
                  '& .MuiInputLabel-outlined.Mui-focused': {
                    color: 'white !important',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white',
                    },
                    '&:hover fieldset': {
                      borderColor: 'white',
                    },
                    '&.Mui-disabled:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'grey',
                      },
                    },
                  },
                  
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '0.5px',
                    borderColor: '#e2e2e1',
                  },

                  borderRadius: '5px',
                }}
              />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker 
                disablePast
                focused
                onChange={ value => setValues({ ...values, ["fechaFin"]: value })}
                value={values.fechaFin}
                label="Fecha y hora de finalización del evento*"
                error={true}
                sx={{ 
                  color: 'white !important',
                  width: '100%', 
                  '& .MuiInputBase-input': {
                    color: '#e2e2e1',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'white',
                  },
                  '& .MuiInputLabel-outlined.Mui-focused': {
                    color: 'white !important',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white',
                    },
                    '&:hover fieldset': {
                      borderColor: 'white',
                    },
                    '&.Mui-disabled:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'grey',
                      },
                    },
                  },
                  
                  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '0.5px',
                    borderColor: '#e2e2e1',
                  },

                  borderRadius: '5px',
                }}
              />
              </LocalizationProvider>
            </Grid>
            
              <Grid container justifyContent='center' spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
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
