import { useState } from 'react';
import { alcompasAPI } from '../api';

export const useVestimentasStore = () => {

    const [ errores, setErrores ] = useState([]); 

    const crearVestimenta = async(vestimentaNueva, bandaId) => {
        try {
            vestimentaNueva.banda = bandaId;
            const { data } = await alcompasAPI.post('vestimentas/', vestimentaNueva);
            const vestimenta = data.nuevaVestimenta;
            return vestimenta;
        } catch(error) {
                
                setErrores(["Error en el servidor, contacta con el administrador"]);
        }
    }

    const getAllVestimentasByBanda = async(bandaId) => {
        try {
            const { data } = await alcompasAPI.get(`vestimentas/banda/${bandaId}`);
            const vestimentas = data.vestimentas;
            return vestimentas;
        } catch(error) {
            console.log("Error obteniendo vestimentas de la banda");
        }
    }

    const editarVestimenta = async(vestimentaEditada) => {
        try {
            const { data } = await alcompasAPI.put(`vestimentas/${vestimentaEditada._id}`, vestimentaEditada);
            const vestimenta = data.nuevaVestimenta;
            return vestimenta;
        } catch(error) {
            console.log("Error editando vestimenta");
        }
    }

    const eliminarVestimenta = async(vestimentaId) => {
        try {
            const { data } = await alcompasAPI.delete(`vestimentas/${vestimentaId}`);
            const vestimenta = data.vestimentaEliminada;
            return vestimenta;
        } catch(error) {
            console.log("Error eliminando vestimenta");
        }
    }

    return {
        crearVestimenta,
        getAllVestimentasByBanda,
        editarVestimenta,
        eliminarVestimenta,
        errores
    }
}