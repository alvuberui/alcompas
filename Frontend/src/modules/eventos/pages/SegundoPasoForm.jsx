import { Button, Grid, Link, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AuthLayout } from '../../../auth/layout/AuthLayout';
import DateTimePicker from 'react-datetime-picker';

import '../../../Theme/picker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

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
                <Grid item className='input-wrapper' xs={ 12 } sx={{ mt: 2}}>
                <label >Temática*</label>
                <TextField 
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
                <Grid item className='input-wrapper' xs={ 12 } sx={{ mt: 3}}>
                <label >Lugar*</label>
                <TextField 
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
            <Grid item className='input-wrapper' xs={ 12 } sx={{ mt: 2}}>
                <label >Localidad*</label>
              <TextField 
               
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
             
            <Grid item className='input-wrapper' xs={ 12 } sx={{ mt: 3}}>
                <label >Provincia*</label>
              <TextField 
               
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
            <Grid item className='input-wrapper' xs={ 12 } sx={{ mt: 3}}>
                <label >Lugar*</label>
              <TextField 
          
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
            <Grid item className='input-wrapper' xs={ 12 } sx={{ mt: 3}}>
                <label >Costes*</label>
              <TextField 
      
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
            <Grid item className='input-wrapper' xs={ 12 } sx={{ mt: 3}}>
                <label >Beneficios*</label>
              <TextField 
           
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
            <Grid item className='input-wrapper' xs={ 12 } sx={{ mt: 3}}>
                <label >Comentario sobre beneficios y costes</label>
                <TextField 
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
                <Grid item className='input-wrapper' xs={ 12 } sx={{ mt: 3}}>
                <label >Lugar de salida*</label>
              <TextField 
                
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
         
              <Grid item className='input-wrapper' xs={ 12 } sx={{ mt: 3}}>
                <label >Fecha y hora de salida*</label>
                <DateTimePicker 
                id="datetime-picker"
                onChange={ value => setValues({ ...values, ["fechaSalida"]: value })} value={values.fechaSalida} />
              </Grid>
    
            </>
            }
            {
              values.tipoEvento == 'procesion' &&
              <>
              <Grid item className='input-wrapper' xs={ 12 } sx={{ mt: 3}}>
                <label >Tipo de procesión*</label>
                <FormControl variant="outlined" fullWidth sx={{ minWidth: 120 }}>
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
                <Grid item className='input-wrapper' xs={ 12 } sx={{ mt: 3}}>
                <label >Día de la procesión*</label>
                  <FormControl variant="outlined" fullWidth sx={{ minWidth: 120 }}>
                    
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
              <Grid item className='input-wrapper' xs={ 12 } sx={{ mt: 3}}>
                <label >Bocadillo tras la procesión*</label>
                <FormControl variant="outlined" fullWidth sx={{ minWidth: 120 }}>
                  
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
              <Grid item className='input-wrapper' xs={ 12 } sx={{ mt: 3}}>
                <label >Nombre de la hermandad*</label>
              <TextField 
        
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
              <Grid item className='input-wrapper' xs={ 12 } sx={{ mt: 3}}>
                <label >Nombre del titular*</label>
              <TextField 
       
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
              <Grid item className='input-wrapper' xs={ 12 } sx={{ mt: 3}}>
                <label >Tipo de actuación*</label>
                <FormControl variant="outlined" fullWidth sx={{ minWidth: 120 }}>
                  
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
               
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
                    Publicar evento
                  </Button>
                </Grid>
              </Grid>
            
           
  
          </Grid>
        </form>
      </AuthLayout>
    )
  }
}