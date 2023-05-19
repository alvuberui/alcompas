import { useState } from 'react';
import { alcompasAPI } from '../api';
import Swal from 'sweetalert2';

export const useContratadosStore = () => {
    const [ errores, setErrores ] = useState([]); 

    const crearContratados = async(contratado) => {
        try {
            const { data } = await alcompasAPI.post('contratados/', contratado);
            const contratadoDB = data.contratadoDB;
            return contratadoDB;
        } catch(error) {
            // Obtener los errores de la respuesta
            const errors = error.response.data.errors;
            const error2 = error.response.data.msg;
            // Recorremos los errores para mostrarlos en el state
            let erroresArray = [];
            for (const key in errors) {
                erroresArray.push(errors[key].msg);
            }
            // Guardar los errores en el state
            if(erroresArray.length > 0) {
                Swal.fire({
                    title: 'Error',
                    text: erroresArray[0],
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                })
            } else {
                Swal.fire({
                    title: 'Error',
                    text: error2,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                })
            }
        }
    }

    const getContratadosByEnveto = async(tipo, referencia) => {
        try {
            const { data } = await alcompasAPI.get(`contratados/evento/${tipo}/${referencia}`);
            const resultados = data.resultados;
            return resultados;
        } catch(error) {
            console.log(error)
            setErrores("No tienes acceso a esta operación");
            setTimeout(() => {
                setErrores([]);
            }, 300);
        }
    }

    const deleteContratado = async(id) => {
        try {
            const { data } = await alcompasAPI.delete(`contratados/${id}`);
            const contratadoDB = data.eliminado;
            return contratadoDB;
        } catch(error) {
            console.log(error)
            setErrores("No tienes acceso a esta operación");
            setTimeout(() => {
                setErrores([]);
            }, 300);
        }
    }

    return {
        // Estado
        errores,
        // Métodos
        setErrores,
        crearContratados,
        getContratadosByEnveto,
        deleteContratado
    }
}