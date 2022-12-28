import React, { Component, useState, useEffect} from 'react'

import { CrearBandaUno, CrearBandaDos, CrearBandaTres } from '../';
import { validarBanda } from '../../../helpers/validarBanda';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useBandasStore } from '../../../hooks/useBandasStore';

const state = {
    nombre: '',
    tipo: '',
    localidad: '',
    provincia: '',
    codigo_postal: '',
    direccion: '',
    año_fundacion: '',
    descripcion: '',
    telefono: '',
    correo: '',
    cif:  '',
}

export const  BandaForm = () => {
    const [step, setStep] = useState(1);

    const  { crearBanda, mensajeError } = useBandasStore();

    let navigate = useNavigate();

    useEffect(() => {
        if(  mensajeError !== '' && mensajeError !== '200' ){
          Swal.fire('Error en la autenticación', mensajeError, 'error');
        }
        setTimeout(()=> {
            if ( mensajeError === '200') {
                navigate('/');
            }
        }, 100);
      }, [mensajeError])

    const [values, setValues] = useState({})
      

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
        
        let error = validarBanda(values);
       
        if(error == '') {
            crearBanda(values);
        }
        else {
            Swal.fire('Error en la autenticación', error, 'error') 
        }

        
    } 

    // Manejar los inputs
    const handleChange = input => e => { 
        values[input] =  e.target.value;
    }

    

    //const cambiar = (step) => {   
        switch(step) {
            case 1:
                return (
                    <CrearBandaUno
                        siguiente = {siguiente}
                        handleChange = { handleChange }
                        values = { values }
                        titulo = 'Crear Banda'
                    />
                );
            case 2:
                return (<CrearBandaDos
                siguiente = {siguiente}
                retroceder = { previo }
                handleChange = { handleChange }
                values = { values }
                titulo = 'Crear Banda'
                />);
            case 3:
                return  <CrearBandaTres
                confirmar = {confirmar}
                retroceder = { previo }
                values = { values }
                titulo = 'Crear Banda'
                />
    }
    
    
}

export default BandaForm
