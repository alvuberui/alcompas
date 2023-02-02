import { useState } from 'react';
import { alcompasAPI } from '../api';

export const useArchiverosStore = () => {

    const [ errores, setErrores ] = useState(''); 
    
    const getArchiverosByUserId = async(userId) => {
        try {
            const { data } = await alcompasAPI.get('archiveros/usuario/id/' + userId);
            const archiveros = data.archivero;
        
            return archiveros;
        } catch(error) {
            console.log('Error cargando archivero');
        }
    }

    return {
        // Estado
        errores,
        // Métodos
        getArchiverosByUserId
    }
}