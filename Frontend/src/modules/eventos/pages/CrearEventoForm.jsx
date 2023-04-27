import React, { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { PrimerPasoForm, SegundoPasoForm } from '../';
import { useEventosStore } from '../../../hooks';
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

    const  { crearProcesion, crearEnsayo, crearActuacion, mensajeError } = useEventosStore();

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

    

    //const cambiar = (step) => {   
        switch(step) {
            case 1:
                return (
                    <PrimerPasoForm
                        siguiente = {siguiente}
                        handleChange = { handleChange }
                        values = { values }
                        titulo = 'Crear Evento'
                        setValues = { setValues }
                    />
                );
            case 2:
                return (<SegundoPasoForm
                confirmar = {confirmar}
                retroceder = { previo }
                handleChange = { handleChange }
                values = { values }
                titulo = 'Crear Evento'
                setValues = { setValues }
                />);
    }
    
    
}

export default CrearEventoForm;
