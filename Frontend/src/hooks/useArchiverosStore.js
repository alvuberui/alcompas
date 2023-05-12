import { useState } from 'react';
import { alcompasAPI } from '../api';
import Swal from 'sweetalert2';


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

    const esArchiveroByBandaId = async(bandaId) => {
        try {
            const { data } = await alcompasAPI.get('archiveros/banda/' + bandaId);
            const archiveros = data.esArchivero;
            return archiveros;
        } catch(error) {
            console.log('Error cargando archivero');
        }
    }

    const getArchiverosByBandaId = async(bandaId) => {
        try {
            const { data } = await alcompasAPI.get('archiveros/archivero/banda/' + bandaId);
            const archiveros = data.diccionario;
            return archiveros;
        } catch(error) {
            console.log('Error cargando archivero');
        }
    }

    const finalizarArchivero = async(userId, bandaId) => {
        try {
            const { data } = await alcompasAPI.put('archiveros/' + userId + '/' + bandaId);
            const archivero = data.archivero;
            return archivero;
        } catch(error) {
            Swal("Error", "No se pudo finalizar el rol de archivero", "error");
        }
    }



    return {
        // Estado
        errores,
        // Métodos
        getArchiverosByUserId,
        esArchiveroByBandaId,
        getArchiverosByBandaId,
        finalizarArchivero
    }
}