import { Grid, Typography, Button, Select, MenuItem, Checkbox, FormControlLabel, Box, Tabs, Tab } from '@mui/material';
import Avatar from '@material-ui/core/Avatar';
import * as React from 'react';
import { NavBar } from '../../../Components';
import { useAuthStore } from '../../../hooks/useAuthStore';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import {  TextField } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { pink } from '@mui/material/colors';
import Swal from 'sweetalert2';

import {
  BrowserRouter as Router,
  Link,
  NavLink,
}  from "react-router-dom";
import { useEstudiosStore } from '../../../hooks';
import { useNavigate } from 'react-router-dom';
import { validarInstrumentos } from '../../../helpers/validarInstrumento';
import { convertDateToForm } from '../../../helpers/convertDate';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50vh',
    bgcolor: '#262254',
    borderRadius: '5px',
    boxShadow: 24,
    p: 4,
    display:'flex',
    alignContent:'center',
    justifyContent:'center'
};
const tipos = [ "Grado elemental", "Grado medio", "Grado superior", "Curso", "Autodidacta", "Otro"];

export const AñadirEstudioModal  = ( { open, handleClose, setEstudios, setOpen, editar, estudioId }) => {

    // Estados
    const [estudio, setEstudio] = useState({tipoEstudio:'Grado elemental', centroEstudios: '', poblacion: '', provincia: '', fechaInicio: '', fechaFin: ''});

    // Funciones
    const { crearEstudio, errores, setErrores, getEstudioById, editarEstudio } = useEstudiosStore();
    const { user } = useAuthStore();

    const validarEstudio =  () => {
      let error = "";
      const fechaActual = new Date().toISOString();
      if(!tipos.includes(estudio.tipoEstudio)) error = "El tipo de estudio no es válido";
      if(estudio.fechaInicio > estudio.fechaFin) error = error + "<br> La fecha de inicio no puede ser mayor que la fecha de fin";
      if(estudio.fechaInicio === '') error = error + "<br> La fecha de inicio no puede estar vacía";
      if(estudio.fechaFin === '') error = error + "<br> La fecha de fin no puede estar vacía";
      if(estudio.fechaInicio > fechaActual) error = error + "<br> La fecha de inicio no puede ser mayor que la fecha actual";
      if(estudio.fechaFin > fechaActual) error = error + "<br> La fecha de fin no puede ser mayor que la fecha actual";
      return error;
    }

    const handleFormEditar = async e => {
      e.preventDefault();
      let error = validarEstudio();
      if(error != "") {
        Swal.fire('Error al editar instrumento', error, 'error');
      }
      else {

        const c = await editarEstudio( estudio, user.uid, estudioId );
        setEstudios( co => [...co, c]);
        setEstudio({tipoEstudio:'Grado elemental', centroEstudios: '', poblacion: '', provincia: '', fechaInicio: '', fechaFin: ''});
        setOpen(false);
      }
    }
   
    const handleForm = async e => {
        e.preventDefault();
        let error = validarEstudio();

        if(error != "") {
          Swal.fire('Error al publicar instrumento', error, 'error');
        }
        else {
          const c = await crearEstudio( estudio, user.uid );
          setEstudios( co => [...co, c]);
          setEstudio({tipoEstudio:'Grado elemental', centroEstudios: '', poblacion: '', provincia: '', fechaInicio: '', fechaFin: ''});
          setOpen(false);
        }
      }
    
      const handleChangeInput = input => e => {    
        estudio[input] =  e.target.value;
      }

      useEffect(() => {
        if(  errores.length > 0 ) {
          let error ='';
          for(let i = 0; i < errores.length; i++) {
            error = error + '<br>' + errores[i];
          }
          Swal.fire('Error al crear comentario', error, 'error');
          setErrores([]);
        }
        
      }, [errores])

      useEffect(() => {
        const getInstrumento = async () => {
          if( editar === true) {
            const i = await getEstudioById(estudioId);
            i.fechaInicio = convertDateToForm(i.fechaInicio);
            i.fechaFin = convertDateToForm(i.fechaFin);
            setEstudio(i);
          }
        }
        getInstrumento();
      }, [editar])
      
      
      
  return (
    <div>
       
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          id="cambiar-contraseña"
        >
          <Box sx={style}>
          
            <form>
                <Typography  variant='h4' sx={{ textAlign:'center' ,color:'white'}} >
                      Añadir Estudio
                    </Typography>
                <Grid container>
                    <Grid item xs={ 12 } >
                    <Typography  sx={{ color:'white'}} >
                      Tipo de estudio *
                    </Typography>
                    <Select
                      style={{ color: 'white', border: '1px solid #e2e2e1' }}
                      inputProps={{ style: { color: 'white' } }} 
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={ estudio.tipoEstudio }
                      label="Age"
                      fullWidth
                      onChange={handleChangeInput('tipoEstudio')}
                    >
                      { tipos.map( (tipo, index) => (
                        <MenuItem key={index} value={tipo}>{tipo}</MenuItem>
                      ))}
                    </Select>
                    </Grid>
                    <Grid item xs={ 12 } >
                    <Typography  sx={{ color:'white'}} >
                      Centro donde cursaste el estudio
                    </Typography>
                    <TextField 
                        sx={{ input: { color: 'white' }}}
                        inputProps={{ style: { color: 'white' } }}
                        type="text"
                        placeholder="Centro de estudios"
                        fullWidth
                        focused
                        value={ estudio.centroEstudios }
                        style={{ border: '1px solid #e2e2e1', borderRadius:'5px'}}
                        onChange={handleChangeInput('centroEstudios')}
                        
                    />
                    <Typography  sx={{ color:'white'}} >
                      Población
                    </Typography>
                    <TextField 
                        sx={{ input: { color: 'white' }}}
                        inputProps={{ style: { color: 'white' } }}
                        type="text"
                        placeholder="Poblacion"
                        value={ estudio.poblacion }
                        fullWidth
                        focused
                        style={{ border: '1px solid #e2e2e1', borderRadius:'5px'}}
                        onChange={handleChangeInput('poblacion')}
                        
                    />
                    <Typography  sx={{ color:'white'}} >
                      Provincia
                    </Typography>
                    <TextField 
                        sx={{ input: { color: 'white' }}}
                        inputProps={{ style: { color: 'white' } }}
                        type="text"
                        placeholder="Provincia"
                        value={ estudio.provincia }
                        fullWidth
                        focused
                        style={{ border: '1px solid #e2e2e1', borderRadius:'5px'}}
                        onChange={handleChangeInput('provincia')}
                    />
                    <Typography  sx={{ color:'white'}} >
                      Fecha de inicio
                    </Typography>
                    <TextField 
                        sx={{ input: { color: 'white' }}}
                        inputProps={{ style: { color: 'white' } }}
                        type="date"
                        placeholder="Fecha de Inicio"
                        value={ estudio.fechaInicio }
                        fullWidth
                        focused
                        style={{ border: '1px solid #e2e2e1', borderRadius:'5px'}}
                        onChange={handleChangeInput('fechaInicio')}
                    />
                    <Typography  sx={{ color:'white'}} >
                      Fecha de inicio
                    </Typography>
                    <TextField 
                        sx={{ input: { color: 'white' }}}
                        inputProps={{ style: { color: 'white' } }}
                        type="date"
                        placeholder="Fecha de finalización"
                        value={ estudio.fechaFin }
                        fullWidth
                        focused
                        style={{ border: '1px solid #e2e2e1', borderRadius:'5px'}}
                        onChange={handleChangeInput('fechaFin')}
                    />
                    </Grid>     
                </Grid>
                <Box  sx={{mt:2, display:'flex', alignContent:'center', justifyContent:'center'}} >
                    { editar === undefined &&
                      <Button color='secondary' sx={{ backgroundColor:'white', color:'black'}} variant='contained' onClick={handleForm}>
                        Añadir estudio
                      </Button>
                    }
                    { editar === true &&
                      <Button color='secondary' sx={{ backgroundColor:'white', color:'black'}} variant='contained' onClick={handleFormEditar}>
                        Editar instrumento
                      </Button>
                    } 
                </Box>
            </form>
          </Box>
        </Modal>
      </div>
  )
}
