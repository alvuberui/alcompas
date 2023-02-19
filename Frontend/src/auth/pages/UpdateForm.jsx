import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { convertDateToForm } from '../../helpers';
import { validarRegistro } from '../../helpers/validarRegistro';
import { useAuthStore } from '../../hooks';
import { AuthLayout } from '../layout/AuthLayout';
import { ConfirmationRegister } from './ConfirmationRegister';
import { LocationRegister } from './LocationRegister';
import { PersonalRegister } from './PersonalRegister';
import { UserRegister } from './UserRegister';

export const  UpdateForm = () => {

    // Estados
    const [values, setValues] = useState([]);
    const [step, setStep] = useState(1);

    // Funciones y parámetros
    const  { startUpdate,  user, getUserByiD } = useAuthStore();
    const { id } = useParams();
    let navigate = useNavigate();

    // Siguiente paso
    const siguiente = () => {
        setStep(step +1)
    }

    // Anterior paso
    const previo = () => {
        setStep(step -1)
    }

    // Confirmar
    const confirmar = async() => {
        values.contraseña = 'asdfgh123456';
        values.confirmacion_contraseña = 'asdfgh123456'
        let error = validarRegistro(values);
    
        if(error == '') {
            const respuesta = await startUpdate({nombre: values.nombre, primer_apellido: values.primer_apellido, segundo_apellido: values.segundo_apellido,
                correo: values.correo, descripcion: values.descripcion, localidad: values.localidad, provincia: values.provincia,
                codigo_postal: values.codigo_postal, direccion: values.direccion, nif: values.nif, telefono: values.telefono,
                usuario: values.usuario, fecha_nacimiento: values.fecha_nacimiento});
            if(respuesta !== ' ' && respuesta !== user.uid) {
                Swal.fire('Error en la autenticación', respuesta , 'error');
            } else {
                navigate("/perfil/" + respuesta);
            }
        }
        else {
            Swal.fire('Error en la autenticación', error, 'error');
        }  
    }

    // Manejar los inputs
    const handleChange = input => e => {    
        values[input] =  e.target.value;
    }
    
    // Efectos
    useEffect(() => {
    const getUser = async () => {
        const userreq = await getUserByiD(user.uid);
        
        const fecha = convertDateToForm(userreq.fecha_nacimiento);
        
        userreq.fecha_nacimiento = fecha;
       
        setValues( userreq);  
    }
    getUser();
    }, []);

    

    

    if(values.length == 0) {
        return (
             <>
             <AuthLayout  title={"Cargando"} >
                <Box  sx={{ display: 'flex', justifyContent:"center", alignItems:"center"}}>
                    <CircularProgress aria-label='loading'  size={200} />
                </Box>
             </AuthLayout>
             </>) 
    } 
        switch(step) {
            case 1:
                return (
                    <>
                        { id !== user.uid && <Navigate to="/" /> }
                        <PersonalRegister
                            siguiente = {siguiente}
                            handleChange = { handleChange }
                            values = { values }
                            titulo = 'Modificar Datos'
                        />
                    </>
                );
            case 2:
                return (
                    <>
                        { id !== user.uid && <Navigate to="/" /> }
                        <LocationRegister
                        siguiente = {siguiente}
                        retroceder = { previo }
                        handleChange = { handleChange }
                        values = { values }
                        titulo = 'Modificar Datos'
                        />
                    </>
                );

            case 3:
                return  (
                <>
                    { id !== user.uid && <Navigate to="/" /> }
                    <UserRegister
                    siguiente = {siguiente}
                    retroceder = { previo }
                    handleChange = { handleChange }
                    values = { values }
                    titulo = 'Modificar Datos'
                    />
                </> );
            case 4:
                return  (
                <>
                    { id !== user.uid && <Navigate to="/" /> }
                    <ConfirmationRegister
                    confirmar = {confirmar}
                    retroceder = { previo }
                    values = { values }
                    titulo = 'Modificar Datos'
                    />
                </> );
        }
    
    
}

export default UpdateForm;