import React, { Component, useState, useEffect} from 'react'
import { PersonalRegister } from './PersonalRegister';
import { LocationRegister } from './LocationRegister';
import { UserRegister } from './UserRegister';
import { ConfirmationRegister } from './ConfirmationRegister';
import { useForm, useAuthStore } from '../../hooks';
import Swal from 'sweetalert2';
import { validarRegistro } from '../../helpers/validarRegistro';

const state = {
    nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    correo: '',
    descripcion: '',
    localidad: '',
    provincia: '',
    codigo_postal: '',
    direccion: '',
    nif: '',
    telefono:  '',
    usuario: '',
    contraseña: '',
    confirmacion_contraseña: '',
    fecha_nacimiento: ''
}

export const  RegisterFrom = () => {
    const [step, setStep] = useState(1);

    const  { startRegister, errorMessage } = useAuthStore();

    useEffect(() => {
        if(  errorMessage !== undefined ) {
          Swal.fire('Error en la autenticación', errorMessage, 'error');
        }
      }, [errorMessage])

    const { nombre, primer_apellido, segundo_apellido, correo,
             descripcion, localidad, provincia, codigo_postal, direccion,
              nif, telefono, usuario, contraseña, confirmacion_contraseña, fecha_nacimiento } =  state;
    const values = { nombre, primer_apellido, segundo_apellido, correo,
            descripcion, localidad, provincia, codigo_postal, direccion,
             nif, telefono, usuario, contraseña, confirmacion_contraseña, fecha_nacimiento }

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
        
        let error = validarRegistro(values);
       
        if(error == '') {
            startRegister({nombre: values.nombre, primer_apellido: values.primer_apellido, segundo_apellido: values.segundo_apellido,
                correo: values.correo, descripcion: values.descripcion, localidad: values.localidad, provincia: values.provincia,
                codigo_postal: values.codigo_postal, direccion: values.direccion, nif: values.nif, telefono: values.telefono,
                usuario: values.usuario, contraseña: values.contraseña, confirmacion_contraseña: values.confirmacion_contraseña,
                 fecha_nacimiento: values.fecha_nacimiento});
        }
        else {
            Swal.fire('Error en la autenticación', error, 'error') 
        }

        
    }

    // Manejar los inputs
    const handleChange = input => e => {
        
        state[input] =  e.target.value;
    
    }

    

    //const cambiar = (step) => {   
        switch(step) {
            case 1:
                return (
                    <PersonalRegister
                        siguiente = {siguiente}
                        handleChange = { handleChange }
                        values = { values }
                        titulo = 'Crear Cuenta'
                    />
                );
            case 2:
                return (<LocationRegister
                siguiente = {siguiente}
                retroceder = { previo }
                handleChange = { handleChange }
                values = { values }
                titulo = 'Crear Cuenta'
                />);
            case 3:
                return  <UserRegister
                siguiente = {siguiente}
                retroceder = { previo }
                handleChange = { handleChange }
                values = { values }
                titulo = 'Crear Cuenta'
                />
            case 4:
                return  <ConfirmationRegister
                confirmar = {confirmar}
                retroceder = { previo }
                values = { values }
                titulo = 'Crear Cuenta'
                />
       // }
    }
    
    
}

export default RegisterFrom
