import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { PrimerPasoForm, SegundoPasoForm } from '../';
import { validarBanda } from '../../../helpers/validarBanda';
import { useEventosStore } from '../../../hooks';
import dayjs from 'dayjs';
import { validarEvento } from '../../../helpers/validarEvento';

export const  ActualizarEventoForm = ( ) => {
    const [step, setStep] = useState(1);

    const  { actualizarProcesion, actualizarEnsayo, actualizarActuacion, mensajeError, getByTipoId } = useEventosStore();
    const { tipoEvento } = useParams();
    const { eventoId } = useParams();

    
    let navigate = useNavigate();

    useEffect(() => {
        if(  mensajeError !== '' && mensajeError !== '200' ){
          Swal.fire('Error Modificando Evento', mensajeError, 'error');
        }
        setTimeout(()=> {
            if ( mensajeError === '200') {
                navigate('/banda/panel/eventos/'+ values.banda);
                setValues({});
            }
        }, 100);
      }, [mensajeError])

    useEffect(() => {
        const getEvento = async () => {
            const evento = await getByTipoId(tipoEvento, eventoId);
            
            evento.fechaInicio = dayjs(evento.fechaInicio).locale('es');
            evento.fechaFin = dayjs(evento.fechaFin).locale('es');
            
            if(tipoEvento === 'Procesión') {
                evento.tipoEvento = 'procesion';
                evento.fechaSalida = dayjs(evento.fechaSalida).locale('es');
            }
            else if(tipoEvento === 'Ensayo') {
                evento.tipoEvento = 'ensayo';
            }
            else if(tipoEvento === 'Actuación') {
                evento.tipoEvento = 'actuacion';
                evento.fechaSalida = dayjs(evento.fechaSalida).locale('es');
            }
            setValues(evento);
        }
        getEvento();
    }, [eventoId, tipoEvento])

    const [values, setValues] = useState({});
    
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
        console.log(values)
        if(error == '') {
            if(values.tipoEvento === 'ensayo') actualizarEnsayo(values, eventoId);
            else if(values.tipoEvento === 'procesion') actualizarProcesion(values, eventoId);
            else actualizarActuacion(values, eventoId);
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

    

    if( ! values.tipoEvento ) return (
        <>
          <Box sx={{ display: 'flex', justifyContent:"center", alignItems:"center"}}>
              <CircularProgress   size={200} />
          </Box>
      
        </>
    )
    else {
        switch(step) {
            case 1:
                return (
                    <PrimerPasoForm
                        siguiente = {siguiente}
                        handleChange = { handleChange }
                        values = { values }
                        titulo = 'Editar Evento'
                        setValues = { setValues }
                    />
                );
            case 2:
                return (<SegundoPasoForm
                confirmar = {confirmar}
                retroceder = { previo }
                handleChange = { handleChange }
                values = { values }
                titulo = 'Editar Evento'
                setValues = { setValues }
                />);
        }
    }
    
    
}

export default ActualizarEventoForm;
