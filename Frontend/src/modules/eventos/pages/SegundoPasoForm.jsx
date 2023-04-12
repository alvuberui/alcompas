import { Button, Grid, Link, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AuthLayout } from '../../../auth/layout/AuthLayout';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export class SegundoPasoForm extends Component {
      retroceder = e => {
        e.preventDefault();
        this.props.retroceder();
    }

    confirmar = e => {
      e.preventDefault();
      this.props.confirmar(e);
    }
    
  render() {
    const { values, handleChange, titulo, setValues } = this.props;
   
    return (
        <AuthLayout  title={titulo} >
        <form>
          <Grid container>
            { values.tipoEvento == 'ensayo' &&
            <>
                <Grid item xs={ 12 } sx={{ mt: 2}}>
                <TextField 
                    label="Temática*"
                    type="text"
                    placeholder="Temática del ensayo*"
                    fullWidth
                    onChange={handleChange('tematica')}
                    defaultValue={values.tematica}
                    color='secondary'
                    rows={15}
                    multiline
                    inputProps={{ style: { color: 'white' } }} 
                    focused
                />
                </Grid>
                <Grid item xs={ 12 } sx={{ mt: 2}}>
                <TextField 
                  label="Lugar*"
                  type="text"
                  placeholder="Lugar"
                  fullWidth
                  onChange={handleChange('lugar')}
                  defaultValue={values.lugar}
                  color='secondary'
                  inputProps={{ style: { color: 'white' } }} 
                  focused
                />
              </Grid>
              </>
                
            }
            {   (values.tipoEvento == 'actuacion' || values.tipoEvento == 'procesion') &&
            <>
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField 
                label="Localidad*"
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
                label="Provincia*"
                type="text"
                placeholder="Provincia"
                fullWidth
                onChange={handleChange('provincia')}
                defaultValue={values.localidad}
                color='secondary'
                inputProps={{ style: { color: 'white' } }} 
                focused
              />
            </Grid>
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField 
                label="Lugar*"
                type="text"
                placeholder="Lugar"
                fullWidth
                onChange={handleChange('lugar')}
                defaultValue={values.lugar}
                color='secondary'
                inputProps={{ style: { color: 'white' } }} 
                focused
              />
            </Grid>
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField 
                label="Costes*"
                type="number"
                placeholder="Costes"
                fullWidth
                onChange={handleChange('costes')}
                defaultValue={values.costes}
                color='secondary'
                inputProps={{ style: { color: 'white' } }} 
                focused
              />
            </Grid>
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField 
                label="Beneficios*"
                type="number"
                placeholder="Beneficios"
                fullWidth
                onChange={handleChange('beneficios')}
                defaultValue={values.beneficios}
                color='secondary'
                inputProps={{ style: { color: 'white' } }} 
                focused
              />
            </Grid>
            <Grid item xs={ 12 } sx={{ mt: 2}}>
                <TextField 
                    label="Comentario sobre beneficios y costes"
                    type="text"
                    placeholder="Comentario sobre beneficios y costes"
                    fullWidth
                    onChange={handleChange('comentarioEconomico')}
                    defaultValue={values.comentarioEconomico}
                    color='secondary'
                    rows={3}
                    multiline
                    inputProps={{ style: { color: 'white' } }} 
                    focused
                />
                </Grid>
                <Grid item xs={ 12 } sx={{ mt: 2}}>
              <TextField 
                label="Lugar de salida*"
                type="text"
                placeholder="Lugar de salida"
                fullWidth
                onChange={handleChange('lugarSalida')}
                defaultValue={values.lugarSalida}
                color='secondary'
                inputProps={{ style: { color: 'white' } }} 
                focused
              />
            </Grid>
            <Grid item xs={ 12 } sx={{ mt: 2}}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker 
                disablePast
                focused
                onChange={ value => setValues({ ...values, ["fechaSalida"]: value })}
                value={values.fechaSalida}
                label="Fecha y hora de salida*"
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
            </>
            }
            {
              values.tipoEvento == 'procesion' &&
              <>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <FormControl variant="outlined" fullWidth sx={{ minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-standard-label" sx={{ color: 'white !important' }}>Tipo de procesión*</InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    label="Tipo de procesión"
                    fullWidth
                    value={values.tipo}
                    onChange={handleChange('tipo')}
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
                    <MenuItem value={'Semana Santa'}>Procesión Semana Santa</MenuItem>
                    <MenuItem value={'Gloria'}>Gloria</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              { values.tipo == 'Semana Santa' &&
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <FormControl variant="outlined" fullWidth sx={{ minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-standard-label" sx={{ color: 'white !important' }}>Día de la procesión*</InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      label="Día de Semana Santa"
                      fullWidth
                      value={values.dia}
                      onChange={handleChange('dia')}
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
                      <MenuItem value={'Viernes Dolores'}>Viernes Dolores</MenuItem>
                      <MenuItem value={'Sábado de Pasión'}>Sábado de Pasión</MenuItem>
                      <MenuItem value={'Domingo de Ramos'}>Domingo de Ramos</MenuItem>
                      <MenuItem value={'Lunes Santo'}>Lunes Santo</MenuItem>
                      <MenuItem value={'Martes Santo'}>Martes Santo</MenuItem>
                      <MenuItem value={'Miércoles Santo'}>Miércoles Santo</MenuItem>
                      <MenuItem value={'Jueves Santo'}>Jueves Santo</MenuItem>
                      <MenuItem value={'Madrugá'}>Madrugá</MenuItem>
                      <MenuItem value={'Viernes Santo'}>Viernes Santo</MenuItem>
                      <MenuItem value={'Sábado Santo'}>Sábado Santo</MenuItem>
                      <MenuItem value={'Domingo de Resurreción'}>Domingo de Resurreción</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              }
              <Grid item xs={12} sx={{ mt: 2 }}>
                <FormControl variant="outlined" fullWidth sx={{ minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-standard-label" sx={{ color: 'white !important' }}>Bocadillo tras las procesión*</InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    label="Bocadillo tras la procesión"
                    fullWidth
                    value={values.bocadillo}
                    onChange={handleChange('bocadillo')}
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
                    <MenuItem value={true}>Sí</MenuItem>
                    <MenuItem value={false}>No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField 
                label="Nombre de la hermandad*"
                type="text"
                placeholder="Nombre de la hermandad"
                fullWidth
                onChange={handleChange('hermandad')}
                defaultValue={values.hermandad}
                color='secondary'
                inputProps={{ style: { color: 'white' } }} 
                focused
              />
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField 
                label="Nombre del titular*"
                type="text"
                placeholder="Nombre del titular"
                fullWidth
                onChange={handleChange('nombreTitular')}
                defaultValue={values.nombreTitular}
                color='secondary'
                inputProps={{ style: { color: 'white' } }} 
                focused
              />
              </Grid>
              </>
              
            }
            {
              values.tipoEvento == 'actuacion' &&
              <Grid item xs={12} sx={{ mt: 2 }}>
                <FormControl variant="outlined" fullWidth sx={{ minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-standard-label" sx={{ color: 'white !important' }}>Tipo de actuación*</InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    label="Tipo de actuación"
                    fullWidth
                    value={values.tipoActuacion}
                    onChange={handleChange('tipoActuacion')}
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
                    <MenuItem value={"Concierto"}>Concierto</MenuItem>
                    <MenuItem value={"Encuentro de Bandas"}>Encuentro de Bandas</MenuItem>
                    <MenuItem value={"Corrida de Toros"}>Corrida de Toros</MenuItem>
                    <MenuItem value={"Pasacalles"}>Pasacalles</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            }
              <Grid container justifyContent='center' spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
              <Grid  item xs={ 6 } >
                  <Button  variant='contained' color='secondary' fullWidth onClick={this.retroceder}>
                    Retroceder
                  </Button>
                </Grid>
                <Grid  item xs={ 6 } >
                  <Button  variant='contained' color="secondary" fullWidth onClick={this.confirmar}>
                    Crear evento
                  </Button>
                </Grid>
              </Grid>
            
           
  
          </Grid>
        </form>
      </AuthLayout>
    )
  }
}