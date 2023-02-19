import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { CrearBandaDos, CrearBandaTres, CrearBandaUno } from '..';
import { validarBanda } from '../../../helpers/validarBanda';
import { useBandasStore, useAuthStore, useDirectivosStore } from '../../../hooks';
import Box from '@mui/material/Box';
import { AuthLayout } from '../../../auth/layout/AuthLayout';

export const  UpdateBandaForm = () => {
    const [step, setStep] = useState(1);

    const { editarBandas, mensajeError, getBandaById } = useBandasStore();
    const { getDirectivoByUserId } = useDirectivosStore();
    const { user } = useAuthStore();
    const { bandaId } = useParams();
    const [values, setValues] = useState([]);
    const [ permiso, setPermiso ] = useState('');

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
    if(values.length == 0 || permiso === '') {
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
                    <>
                    { permiso === false && <Navigate to='/' /> }
                    <CrearBandaUno
                        siguiente = {siguiente}
                        handleChange = { handleChange }
                        values = { values }
                        titulo = 'Editar Banda'
                    />
                    </>
                );
            case 2:
                return (
                <>
                { permiso === false && <Navigate to='/' /> }
                <CrearBandaDos
                siguiente = {siguiente}
                retroceder = { previo }
                handleChange = { handleChange }
                values = { values }
                titulo = 'Editar Banda'
                />
                </>);
            case 3:
                return  (
                <>
                { permiso === false && <Navigate to='/' /> }
                <CrearBandaTres
                confirmar = {confirmar}
                retroceder = { previo }
                values = { values }
                titulo = 'Editar Banda'
                />
                </>);
        }
    }
    
}

export default UpdateBandaForm