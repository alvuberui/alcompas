import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useNavigate, useParams,Navigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import { PrimerPasoForm, SegundoPasoForm } from '../';
import { useDirectivosStore, useEventosStore, useAuthStore } from '../../../hooks';
import { validarEvento } from '../../../helpers/validarEvento';


const state = {
    titulo: '',
    descripcion: '',
    fechaInicio: new Date('2025-04-28T20:00:00.000Z'),
    fechaFin: new Date('2025-04-28T21:00:00.000Z'),
    localidad: '',
    provincia: '',
    lugar: '',
    costes: '',
    beneficios: '',
    dia: 'Viernes Dolores',
    tipo:  'Semana Santa',
    fechaSalida:  new Date('2025-04-28T19:00:00.000Z'),
    lugarSalida:  '',
    bocadillo:  false,
    hermandad:  '',
    nombreTitular:  '',
    tematica: '',
    tipoActuacion:  'Concierto',
    tipoEvento:  'ensayo',
}

export const  CrearEventoForm = () => {
    const [step, setStep] = useState(1);
    const [ permiso, setPermiso ] = useState('')
  

    const  { crearProcesion, crearEnsayo, crearActuacion, mensajeError } = useEventosStore();
    const { getDirectivoByUserId } = useDirectivosStore();
    const { user } = useAuthStore();

    let navigate = useNavigate();

    useEffect(() => {
        if(  mensajeError !== '' && mensajeError !== '200' ){
          Swal.fire('Error Creando Evento', mensajeError, 'error');
        }
        setTimeout(()=> {
            if ( mensajeError === '200') {
                navigate('/banda/panel/eventos/'+ bandaId);
                setValues(state);
            }
        }, 100);
      }, [mensajeError])

    const [values, setValues] = useState(state)
    const { bandaId } = useParams();
      

    // Siguiente paso
    const siguiente = () => {
  
        setStep(step +1)
        
    }

    // Anterior paso
    const previo = () => {
        setStep(step -1)
    }

    // Confirmar
    
    const confirmar = () => {
        
        let error = validarEvento(values);
        
        if(error == '') {
            values.banda=bandaId;
            if(values.tipoEvento === 'ensayo') crearEnsayo(values);
            if(values.tipoEvento === 'procesion') crearProcesion(values);
            if(values.tipoEvento === 'actuacion') crearActuacion(values);
        }
        else {
            Swal.fire('Error creando evento', error, 'error') 
        }    
    } 

    // Manejar los inputs
    const handleChange = input => e => { 
        const { value } = e.target;
        setValues({ ...values, [input]: value });
    }

    useEffect (() => {
        const getPermiso = async () => {
            const directivoreq = await getDirectivoByUserId(user.uid);
            
            let condicion = false
            for( const directivo of directivoreq ) {
               
              if( directivo.fecha_final === undefined && directivo.banda === bandaId && directivo.usuario === user.uid ) {
                condicion = true;
              } 
            }
            setPermiso(condicion)
          }
          getPermiso();
    }, [])

    
    if( permiso === '' ) return (
        <>
      
          <Box sx={{ display: 'flex', justifyContent:"center", alignItems:"center"}}>
              <CircularProgress   size={200} />
          </Box>
      
        </>
    )
    else {
    //const cambiar = (step) => {  
         
        switch(step) {
            case 1:
                return (
                    <>
                    
                    { permiso === false && <Navigate to='/' /> }
                    <PrimerPasoForm
                        siguiente = {siguiente}
                        handleChange = { handleChange }
                        values = { values }
                        titulo = 'Crear Evento'
                        setValues = { setValues }
                    />
                    </>
                );
            case 2:
                
                return (
                    <>
                    
                    { permiso === false && <Navigate to='/' /> }
                <SegundoPasoForm
                confirmar = {confirmar}
                retroceder = { previo }
                handleChange = { handleChange }
                values = { values }
                titulo = 'Crear Evento'
                setValues = { setValues }
                />
                </>);
                
    }
}
    
}

export default CrearEventoForm;
