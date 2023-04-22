import { useState } from 'react';
import { alcompasAPI } from '../api';

export const useContratadosStore = () => {
    const [ errores, setErrores ] = useState([]); 

    const crearContratados = async(contratado) => {
        try {
            const { data } = await alcompasAPI.post('contratados/', contratado);
            const contratadoDB = data.contratadoDB;
            return contratadoDB;
        } catch(error) {
            console.log(error)
            setErrores("No tienes acceso a esta operación");
            setTimeout(() => {
                setErrores([]);
            }, 300);
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