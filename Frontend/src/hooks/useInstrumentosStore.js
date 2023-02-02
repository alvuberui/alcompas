import { useState } from 'react';
import { alcompasAPI } from '../api';
export const useInstrumentosStore = () => {

    const [ errores, setErrores ] = useState([]); 

    const getInstrumentosByUserId = async(userId) => {
        try {
            const { data } = await alcompasAPI.get('instrumentos/instrumentosByUserId/' + userId);
            const instrumentos = data.instrumentos;
            return instrumentos;
        } catch(error) {
            console.log('Error cargando instrumentos');
        }
    }

    const getInstrumentosById = async(instrumentoId) => {
        try {
            const { data } = await alcompasAPI.get('instrumentos/instrumentosById/' + instrumentoId);
            const instrumento = data.instrumento;
            return instrumento;
        } catch(error) {
            console.log('Error cargando instrumento');
        }
    }

    const crearInstrumentoUsuario = async(instrumentoNuevo, userId) => {
        try {
            instrumentoNuevo.usuario = userId;
            const { data } = await alcompasAPI.post('instrumentos/usuario', instrumentoNuevo);
            const instrumento = data.instrumentoGuardado;
            return instrumento;
        } catch(error) {
            
            setErrores(["Error en el servidor"]);
        }
    }

    const editarInstrumentoUsuario = async(instrumentoNuevo, userId, instrumentoId) => {
        try {
            instrumentoNuevo.usuario = userId;
            const { data } = await alcompasAPI.put('instrumentos/usuario/' + instrumentoId, instrumentoNuevo);
            const instrumento = data.instrumentoActualizado;
            return instrumento;
        } catch(error) {
            setErrores(["Error en el servidor"]);
        }
    }

    const eliminarInstrumento = async(instrumentoId) => {
        try {
            const { data } = await alcompasAPI.delete('instrumentos/' + instrumentoId);
            return data.instrumento
        } catch(error) {
            console.log('Error eliminando instrumento');
         
        }
    }



    return {
        // Estado
        errores,
        // Métodos
        setErrores,
        crearInstrumentoUsuario,
        getInstrumentosByUserId,
        eliminarInstrumento,
        getInstrumentosById,
        editarInstrumentoUsuario
    }
}