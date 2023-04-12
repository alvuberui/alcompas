import { useState } from 'react';
import Swal from 'sweetalert2';
import { alcompasAPI } from '../api';
export const useEventosStore = () => {

    const [ mensajeError, setMensajeError ] = useState('');


    const crearActuacion = async(values) => {
        try {
            const { data } = await alcompasAPI.post('eventos/actuacion', values );
            const banda = data.banda;
            setMensajeError('200');
            setTimeout(()=> {
                setMensajeError('');
            }, 10);
        
            return banda;
        } catch(error) {
            console.log(error)
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

    const crearEnsayo = async(values) => {
        try {
            const { data } = await alcompasAPI.post('eventos/ensayo', values );
            const banda = data.banda;
            setMensajeError('200');
            setTimeout(()=> {
                setMensajeError('');
            }, 10);
        
            return banda;
        } catch(error) {
            console.log(error)
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

    const crearProcesion = async(values) => {
        try {
            const { data } = await alcompasAPI.post('eventos/procesion', values );
            const banda = data.banda;
            setMensajeError('200');
            setTimeout(()=> {
                setMensajeError('');
            }, 10);
        
            return banda;
        } catch(error) {
            console.log(error)
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

    const editarBandas = async(values, id) => {
        try {
            const { data } = await alcompasAPI.put('bandas/' + id, values );
            const banda = data.banda;
            setMensajeError('200');
            setTimeout(()=> {
                setMensajeError('');
            }, 10);
            return banda;
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

    const getDestacados = async(fecha) => {
        try {
            const { data } = await alcompasAPI.post('eventos/destacados/fecha', fecha);
            const eventos = data.eventos;
            return eventos;
        } catch(error) {
            console.log(error)
            setMensajeError("Error obteniendo los eventos");
        }
    }

    const getEventosByDateAndBanda = async(datos) => {
        try {
            const { data } = await alcompasAPI.post('eventos/banda/fecha', datos);
            const eventos = data.eventos;
            return eventos;
        } catch(error) {
            console.log(error)
        }
    }

    return {
        mensajeError,
        // Métodos,
        crearProcesion,
        crearActuacion,
        crearEnsayo,
        getDestacados,
        getEventosByDateAndBanda
    }
}