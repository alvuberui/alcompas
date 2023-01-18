import { useState } from 'react';
import { alcompasAPI } from '../api';
export const useRedesSocialesStore = () => {
  

    const [ errores, setErrores ] = useState(''); 

    const crearRedSocial= async(bandaId, nuevaRedSocial) => {
        try {
            nuevaRedSocial.banda = bandaId;
            const { data } = await alcompasAPI.post('redes/', nuevaRedSocial);
            const red = data.nuevaRedSocial;
            return red;
        } catch(error) {
            let fallo = '';
            const objetos = Object(error.response.data.errors); 
            for(const objeto in objetos) {
                let arreglo = objetos[objeto];
                fallo = arreglo['msg'];
                break;
            }
            if(error.response.data) {
                setErrores(error.response.data?.msg);
            } else {
                setErrores(fallo);
            }
            setTimeout(()=> {
                setErrores('');
            }, 10); 
        }
    }

    const getAllByBandaId = async(bandaId) => {
        try {   
            const { data } = await alcompasAPI.get(`redes/banda/id/${bandaId}`);   
            const redes = data.redes;   
            return redes;
        } catch(error) {
            console.log("Error obteniendo las redes sociales de la banda");
        }
    }

    const eliminarRedSocial = async(redId) => {
        try {
            const { data } = await alcompasAPI.delete(`redes/${redId}`);
            return data.red
        }
        catch(error) {
            console.log("Error eliminando la red social");
            setErrores("Error eliminando la red social");
            setTimeout(()=> {
                setErrores('');
            }, 10); 
        }
    }

    return {
        // Estado
        errores,
        setErrores,
        // Funciones
        crearRedSocial,
        getAllByBandaId,
        eliminarRedSocial
    }
}
