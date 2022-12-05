import { useDispatch, useSelector } from 'react-redux';
import { alcompasAPI} from '../api';
import { useAuthStore } from './';
import React, { Component, useState, useEffect} from 'react';
export const useInstrumentosStore = () => {

    const [ errores, setErrores ] = useState([]); 

    const crearInstrumentoUsuario = async(instrumentoNuevo, userId) => {
        try {
            instrumentoNuevo.usuario = userId;
            const { data } = await alcompasAPI.post('instrumentos/usuario', instrumentoNuevo);
            const instrumento = data.instrumentoGuardado;
            return instrumento;
        } catch(error) {
            const erroresObj = error.response.data.errors;
            let res = [];
            
            for(const error in erroresObj) {
                res.push(erroresObj[error].msg);7
            }
            setErrores(res);
        }
    }



    return {
        // Estado
        errores,
        // Métodos
        setErrores,
        crearInstrumentoUsuario,
    }
}