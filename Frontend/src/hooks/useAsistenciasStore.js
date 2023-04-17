import { useState } from 'react';
import { alcompasAPI } from '../api';

export const useAsistenciasStore = () => {

    const [ errores, setErrores ] = useState(''); 
    
    const crearAsistencia = async(asistencia) => {
        try {
            const { data } = await alcompasAPI.post('asistencias/', asistencia);
            const asistenciaDB = data.asistenciaDB;
            return asistenciaDB;
        } catch(error) {
            // Obtener los errores de la respuesta
            const errores = error.response.data.errors;
            // Recorremos los errores para mostrarlos en el state
            let erroresArray = [];
            for (const key in errores) {
                erroresArray.push(errores[key].msg);
            }
            // Guardar los errores en el state
            setErrores(erroresArray[0]);
            setTimeout(() => {
                setErrores('');
            }
            , 100);
        }
    }

    const actualizarAsistencia = async(asistencia, asistenciaId) => {
        try {
            const { data } = await alcompasAPI.put('asistencias/' + asistenciaId, asistencia);
            const asistenciaDB = data.asistenciaDB;
            return asistenciaDB;
        } catch(error) {
            console.log(error)
            // Obtener los errores de la respuesta
            const errores = error.response.data.errores;
            // Guardar los errores en el state
            setErrores(errores);
            setTimeout(() => {
                setErrores('');
            }
            , 100);
        }
    }

    const getAsistenciaByUsuarioEventoAndTipo = async(usuarioId, eventoId, tipoEvento) => {
        try {
            const { data } = await alcompasAPI.get(`asistencias/usuario/${usuarioId}/evento/${eventoId}/tipo/${tipoEvento}`);
            const asistencia = data.asistencia;
            return asistencia;
        } catch(error) {
            console.log(error);
        }
    }

    return {
        // Estado
        errores,
        // Métodos
        crearAsistencia,
        actualizarAsistencia,
        getAsistenciaByUsuarioEventoAndTipo
    }
}