import { useDispatch, useSelector } from 'react-redux';
import { alcompasAPI} from '../api';
import React, { Component, useState, useEffect} from 'react'
import Swal from 'sweetalert2';
export const useBandasStore = () => {

    const [ mensajeError, setMensajeError ] = useState('');

    const getBandaById = async(bandaId) => {
        try {
            const { data } = await alcompasAPI.get('bandas/' + bandaId);
            const banda = data.banda;
            
            return banda;
        } catch(error) {
            console.log('Error cargando banda');
   
        }
    }

    const getBandas = async() => {
        try {
            const { data } = await alcompasAPI.get('bandas/');
            const bandas = data.bandas;
            
            return bandas;
        } catch(error) {
            console.log('Error cargando banda');
         
        }
    }

    const getBandasByUserId = async(userId) => {
        try {
            const { data } = await alcompasAPI.get('bandas/misbandas/' + userId);
            const bandas = data.bandas;
            
            return bandas;
        } catch(error) {
            console.log('Error cargando bandas');
        
        }
    }

    const getBandasByNombre= async(nombre) => {
        try {
            const { data } = await alcompasAPI.get('bandas/buscar/' + nombre);
            const bandas = data.resultado;
            
            return bandas;
        } catch(error) {
            console.log('Error cargando bandas');
           
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

    const eliminarBanda = async(bandaId) => {
        try {
            const { data } = await alcompasAPI.delete('bandas/' + bandaId);
            const banda = data.banda_eliminada;
            return banda;
        } catch(error) {
            Swal.fire({
                title: 'Error',
                text: 'No tiene permisos para eliminar la banda',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            })
        }
    }

    return {
        mensajeError,
        // Métodos
        getBandaById,
        crearBanda,
        getBandasByUserId,
        getBandas,
        getBandasByNombre,
        eliminarBanda
    }
}