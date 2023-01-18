import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CrearBandaDos, CrearBandaTres, CrearBandaUno } from '..';
import { validarBanda } from '../../../helpers/validarBanda';
import { useBandasStore } from '../../../hooks/useBandasStore';
import Box from '@mui/material/Box';
import { AuthLayout } from '../../../auth/layout/AuthLayout';

export const  UpdateBandaForm = () => {
    const [step, setStep] = useState(1);

    const { editarBandas, mensajeError, getBandaById } = useBandasStore();
    const { bandaId } = useParams();
    const [values, setValues] = useState([])

    let navigate = useNavigate();

    useEffect(() => {
        if(  mensajeError !== '' && mensajeError !== '200' ){
          Swal.fire('Error en la autenticación', mensajeError, 'error');
        }
        setTimeout(()=> {
            if ( mensajeError === '200') {
                navigate('/banda/' + bandaId);
            }
        }, 100);
      }, [mensajeError])

      useEffect(() => {
        const getBanda = async () => {
            const banda = await getBandaById(bandaId);
            setValues(banda);
        }
        getBanda();
      }, [])

      

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
            
            editarBandas(values, bandaId);    
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
    if(values.length == 0) {
        return (
        <>
            <AuthLayout  title={"Cargando"} >
                <Box sx={{ display: 'flex', justifyContent:"center", alignItems:"center"}}>
                    <CircularProgress   size={200} />
                </Box>
            </AuthLayout>
        </>) 
    } else {

    //const cambiar = (step) => {   
        switch(step) {
            case 1:
                return (
                    <CrearBandaUno
                        siguiente = {siguiente}
                        handleChange = { handleChange }
                        values = { values }
                        titulo = 'Editar Banda'
                    />
                );
            case 2:
                return (<CrearBandaDos
                siguiente = {siguiente}
                retroceder = { previo }
                handleChange = { handleChange }
                values = { values }
                titulo = 'Editar Banda'
                />);
            case 3:
                return  <CrearBandaTres
                confirmar = {confirmar}
                retroceder = { previo }
                values = { values }
                titulo = 'Editar Banda'
                />
        }
    }
    
}

export default UpdateBandaForm