import { useDispatch, useSelector } from 'react-redux';
import { alcompasAPI} from '../api';
import { useAuthStore } from './';
import React, { Component, useState, useEffect} from 'react';
export const useEstudiosStore = () => {

    const [ errores, setErrores ] = useState([]); 

    const getEstudiosByUserId = async(userId) => {
        try {
            const { data } = await alcompasAPI.get(`estudios/estudiosByUserId/${userId}`);
            const estudios = data.estudios;
            return estudios;
        } catch(error) {
            console.log("error cargando estudios");
        }
    }   

    const eliminarEstudio = async(estudioId) => {
        try {
            const { data } = await alcompasAPI.delete(`estudios/eliminarById/${estudioId}`);
            const estudio = data.estudio;
            return estudio;
        } catch(error) {
            console.log("error eliminando estudio");
        }
    }   

    const crearEstudio = async(estudioNuevo, userId) => {
        try {
            estudioNuevo.usuario = userId;
            const { data } = await alcompasAPI.post('estudios/', estudioNuevo);
            const estudio = data.estudio;
            return estudio;
        } catch(error) {
            const erroresObj = error.response.data.errors;
            let res = [];
            
            for(const error in erroresObj) {
                res.push(erroresObj[error].msg);7
            }
            setErrores(res);
        }
    }

    const editarEstudio = async(estudioNuevo, userId, estudioId) => {
        try {
            estudioNuevo.usuario = userId;
            const { data } = await alcompasAPI.put('estudios/' + estudioId, estudioNuevo);
            const estudio = data.estudio;
            return estudio;
        } catch(error) {
            console.log(error)
            const erroresObj = error.response.data.errors;
            let res = [];
            
            for(const error in erroresObj) {
                res.push(erroresObj[error].msg);7
            }
            setErrores(res);
        }
    }

    const getEstudioById = async(estudioId) => {
        try {
            const { data } = await alcompasAPI.get('estudios/estudioById/' + estudioId);
            const estudio = data.estudio;
            return estudio;
        } catch(error) {
            console.log('Error cargando estudio');
        }
    }





    return {
        // Estado
        errores,
        // Métodos
        setErrores,
        crearEstudio,
        getEstudiosByUserId,
        eliminarEstudio,
        editarEstudio,
        getEstudioById
    }
}