import { useState } from 'react';
import { alcompasAPI } from '../api';

export const useTransaccionesStore = () => {
    const [ errores, setErrores ] = useState([]); 

    const crearTransaccion = async(transaccion) => {
        try {
            const { data } = await alcompasAPI.post('transacciones/', transaccion);
            const transaccionDB = data.transaccionDB;
            return transaccionDB;
        } catch(error) {
            setErrores("No tienes acceso a esta operación");
        }
    }

    const getByBanda = async(bandaId) => {
        try {
            const { data } = await alcompasAPI.get(`transacciones/banda/${bandaId}`);
            const transacciones = data.transacciones;
            return transacciones;
        } catch(error) {
            setErrores([]);
        }
    }

    return {
        // Estado
        errores,
        // Métodos
        setErrores,
        crearTransaccion,
        getByBanda
    }
}
