
import { Button, CircularProgress, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuthStore, usePrestamosStore } from '../hooks';
import { useInstrumentosStore } from '../hooks/useInstrumentosStore';
import { AñadirInstrumentoModal } from '../modules/user/';
import { NuevoPrestamo } from '../modules/banda/modals/NuevoPrestamo';
import { NavLink } from 'react-router-dom';

export const Prestamo = ({ prestamo }) => {

    if( !prestamo ) {
        <CircularProgress size={200}></CircularProgress>
    }
    else {
  console.log(prestamo)
  return (
        
        <Grid 
        container
        sx={{ mt:'15px', maxWidth:'95%', padding:2, backgroundColor:'white', borderRadius:'5px',  borderColor:'white', boxShadow:'rgba(0, 0, 0, 0.14) 0px 1px 1px 1px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px,  rgba(0, 0, 0, 0.2) 0px 1px 3px 1px'  }}
        >   
            <Grid
            container
            display="flex"
            justifyContent="center"
            alignItems="baseline">
                <>
                    <Typography variant='h6' sx={{fontWeight: 'bold', textAlign:'center', color:'black'}}>{'Préstamo de ' + prestamo.tipo + ' - ' + prestamo.referencia.banda.tipo + ' ' + prestamo.referencia.banda.nombre} </Typography>
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
                            <b>Estado:</b> { prestamo.estado }
                        </Typography>
                        <br/>
                        <Typography style={{display: 'inline-block'}}>
                            <b>Fecha de inicio:</b> { prestamo.fechaInicio }
                        </Typography>
                        <br/>
                        { prestamo.fechaFin &&
                        <>
                        <Typography style={{display: 'inline-block'}}>
                            <b>Fecha fin:</b> { prestamo.fechaFin }
                        </Typography>
                        <br/>
                        </>
                        }
                        <Typography style={{display: 'inline-block'}}>
                            <b>Comentario:</b> { prestamo.comentario ? prestamo.comentario : 'Sin comentario' }
                        </Typography>
                        <br/>
                        { prestamo.tipo === 'Instrumento' &&

                        <Typography style={{display: 'inline-block'}}>
                            <b>Instrumento:</b> { prestamo.referencia.instrumento } { prestamo.referencia.marca && prestamo.referencia.marca  } { prestamo.referencia.modelo && prestamo.referencia.modelo } { prestamo.referencia.numeroSerie && prestamo.referencia.numeroSerie }
                        </Typography>
                        }

                        
                    </div>
                </Grid> 
            </Grid>
        </Grid>
        
    );}
}