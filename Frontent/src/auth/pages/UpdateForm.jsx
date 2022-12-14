import React, { Component, useState, useEffect} from 'react'
import { PersonalRegister } from './PersonalRegister';
import { LocationRegister } from './LocationRegister';
import { UserRegister } from './UserRegister';
import { ConfirmationRegister } from './ConfirmationRegister';
import { useForm, useAuthStore } from '../../hooks';
import Swal from 'sweetalert2';
import { validarRegistro } from '../../helpers/validarRegistro';
import { Navigate, useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { AuthLayout } from '../layout/AuthLayout';
import { convertDateToForm } from '../../helpers';
import { useNavigate } from 'react-router-dom';

export const  UpdateForm = () => {

    // Estados
    const [values, setValues] = useState([]);
    const [step, setStep] = useState(1);

    // Funciones y parámetros
    const  { startUpdate, errorMessage, user, getUserByiD } = useAuthStore();
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
            if(respuesta[0 ] === ' ') {
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
    } 
        switch(step) {
            case 1:
                return (
                    <PersonalRegister
                        siguiente = {siguiente}
                        handleChange = { handleChange }
                        values = { values }
                        titulo = 'Modificar Datos'
                    />
                );
            case 2:
                return (<LocationRegister
                siguiente = {siguiente}
                retroceder = { previo }
                handleChange = { handleChange }
                values = { values }
                titulo = 'Modificar Datos'
                />);
            case 3:
                return  <UserRegister
                siguiente = {siguiente}
                retroceder = { previo }
                handleChange = { handleChange }
                values = { values }
                titulo = 'Modificar Datos'
                />
            case 4:
                return  <ConfirmationRegister
                confirmar = {confirmar}
                retroceder = { previo }
                values = { values }
                titulo = 'Modificar Datos'
                />
        }
    
    
}

export default UpdateForm;