import { useState } from 'react';
import { alcompasAPI } from '../api';

export const useAnunciosStore = () => {
    const [ errores, setErrores ] = useState([]); 

    const crearAnuncio = async(anuncioNuevo) => {
        try {
            const { data } = await alcompasAPI.post('noticias/', anuncioNuevo);
            const anuncio = data.anuncioDB;
            return anuncio;
        } catch(error) {
            setErrores(["Error en el servidor, contacta con el administrador"]);
        }
    }
    return {
        // Estado
        errores,
        // Métodos
        setErrores,
        crearAnuncio,
    }
}

