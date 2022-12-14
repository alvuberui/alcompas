
import { Grid, Typography, Button, Box } from '@mui/material';
import { useBandasStore, useDirectivosStore, useAuthStore, usePeticionesStore, useComentariosStore } from '../hooks';
import { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Link,
    NavLink,
  }  from "react-router-dom";
import Swal from 'sweetalert2';
import { useEstudiosStore } from '../hooks/useEstudiosStore';
import { AñadirEstudioModal } from '../modules/user/';


export const Estudio = ({ _id, tipoEstudio, centroEstudios, poblacion, provincia, fechaInicio, fechaFin, setEstudios, usuario, eliminar }) => {
    // Estados
    const [ usuarioPet, setUsuario ] = useState([]);
    const [ open, setOpen ] = useState(false);
    const [ fechaI, setFechaInicio ] = useState(fechaInicio);
    const [ fechaF, setFechaFin ] = useState(fechaFin);
    // Funciones
    const { getUserByiD } = useAuthStore();
    const { eliminarEstudio } = useEstudiosStore();
    

    const handleOpenEditar = (event, newValue, editar) => {
        event.preventDefault();
        setOpen(true);
    };
    const handleCloseEditar = (event, newValue) => {
        event.preventDefault();
        setOpen(false);
      };

    const handleElminar = e => {
        e.preventDefault();
    Swal
    .fire({
        title: "¿Está seguro de que desea eliminar su estudio?",
        text: "Esta acción será irreversible y no podrá recuperarlo",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
    })
    .then(async resultado => {
        if (resultado.value) {
            // Hicieron click en "Sí"
            const c = await eliminarEstudio(_id);
            eliminar(_id);
        }
    });
    }
    

    // Efectos
    useEffect(() => {
        const getUsuario = async () => {
            const usuarioreq = await getUserByiD(usuario);
            setUsuario(usuarioreq);  
        }
        getUsuario();
    }, [open]);

    // Efectos
    useEffect(() => {
        const convertirFecha = async () => {
            setFechaInicio(new Date(fechaInicio).toLocaleDateString());
            setFechaFin(new Date(fechaFin).toLocaleDateString());
        }
        convertirFecha();
    }, [fechaInicio, fechaFin]);

  
  return (
        
        <Grid 
        container
        sx={{ mt:'15px', maxWidth:'125vh', padding:2, backgroundColor:'white', borderRadius:'5px', border:1, borderColor:'white', boxShadow:' 1px 1px 1px 1px' }}
        >   
            <AñadirEstudioModal  estudioId={_id} editar={open} open={open} handleClose={handleCloseEditar} setOpen={setOpen} setEstudios={setEstudios}></AñadirEstudioModal>
            <Grid
            container
            display="flex"
            justifyContent="center"
            alignItems="baseline">
                <>
                    <Typography variant='h6' sx={{fontWeight: 'bold', textAlign:'center', color:'black'}}>{tipoEstudio}</Typography>

                </>
            </Grid>
            <Grid
            container
            >
                <Grid 
                item
                xs= { 12 }
                sx={{ padding:2 }}
                >   
                    <div>
                    <Typography style={{display: 'inline-block'}}>
                            <b>Centro de estudios:</b> { centroEstudios || 'No especificado' }
                        </Typography>
                        <br></br>
                        <Typography style={{display: 'inline-block'}}>
                            <b>Población:</b> { poblacion || 'No especificado' }
                        </Typography>
                        <br></br>
                        <Typography style={{display: 'inline-block'}}>
                            <b>Provincia:</b> {provincia || 'No especificado'}
                        </Typography>
                        <br></br>
                        <Typography style={{display: 'inline-block'}}>
                            <b>Fecha de inicio:</b> {fechaI || 'No especificado'}
                        </Typography>
                        <br></br>
                        <Typography style={{display: 'inline-block'}}>
                            <b>Fecha de finalización:</b> {fechaF || 'No especificado'}
                        </Typography>
                    </div>
                </Grid> 
                <Grid 
                item
                xs= { 12 }
             
                display="flex"
                justifyContent="center"
                alignItems="baseline"
                >   
                    <div>
                        <Button color='primary' onClick={handleOpenEditar}  sx={{mr:'5px'}} variant='contained'>
                            <Typography sx={{ fontWeight: 'bold', fontSize:'12px' }} >Editar</Typography>
                        </Button>
                        <Button color='primary' onClick={handleElminar} sx={{ml:'5px'}} variant='contained'>
                            <Typography sx={{ fontWeight: 'bold', fontSize:'12px' }} >Eliminar</Typography>
                        </Button>
                    </div>
                </Grid> 
            </Grid>
        </Grid>
        
    );
}