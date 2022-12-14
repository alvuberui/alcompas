import { useDispatch, useSelector } from 'react-redux';
import { alcompasAPI} from '../api';
import React, { Component, useState, useEffect} from 'react'
export const useBandasStore = () => {

    const [ mensajeError, setMensajeError ] = useState('');

    const getBandaById = async(bandaId) => {
        try {
            const { data } = await alcompasAPI.get('bandas/' + bandaId);
            const banda = data.banda;
            
            return banda;
        } catch(error) {
            console.log('Error cargando banda');
            console.log(error)
        }
    }

    const getBandas = async() => {
        try {
            const { data } = await alcompasAPI.get('bandas/');
            const bandas = data.bandas;
            
            return bandas;
        } catch(error) {
            console.log('Error cargando banda');
            console.log(error)
        }
    }

    const getBandasByUserId = async(userId) => {
        try {
            const { data } = await alcompasAPI.get('bandas/misbandas/' + userId);
            const bandas = data.bandas;
            
            return bandas;
        } catch(error) {
            console.log('Error cargando bandas');
            console.log(error)
        }
    }

    const getBandasByNombre= async(nombre) => {
        try {
            const { data } = await alcompasAPI.get('bandas/buscar/' + nombre);
            const bandas = data.resultado;
            
            return bandas;
        } catch(error) {
            console.log('Error cargando bandas');
            console.log(error)
        }
    }

    const crearBanda = async(values) => {
        try {
            const { data } = await alcompasAPI.post('bandas/', values );
            const banda = data.banda;
            setMensajeError('200');
            setTimeout(()=> {
                setMensajeError('');
            }, 10);
        } catch(error) {
            let fallo = ''
            const objetos = Object(error.response.data.errors); 
            for(const objeto in objetos) {
                let arreglo = objetos[objeto];
                fallo = arreglo['msg'];
                break;
            }
            if(error.response.data) {
                setMensajeError(error.response.data?.msg);
            } else {
                setMensajeError(fallo);
            }
            setTimeout(()=> {
                setMensajeError('');
            }, 10);
        }
    }

    return {
        mensajeError,
        // M??todos
        getBandaById,
        crearBanda,
        getBandasByUserId,
        getBandas,
        getBandasByNombre
    }
}