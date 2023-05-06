import { alcompasAPI } from '../api';
import Swal from 'sweetalert2';

export const useRepertoriosStore = () => {

    const crearRepertorio = async(bandaId, nuevoRepertorio) => {
        try {
            nuevoRepertorio.banda = bandaId;
            const { data } = await alcompasAPI.post('repertorios/', nuevoRepertorio);
            const repertorio = data.nuevoRepertorio;
            return repertorio;
        } catch(error) {
            console.log(error)
             // Obtener los errores de la respuesta
             const errors = error.response.data.errors;
             const error2 = error.response.data.msg;
             // Recorremos los errores para mostrarlos en el state
             let erroresArray = [];
             for (const key in errors) {
                 erroresArray.push(errors[key].msg);
             }
             // Guardar los errores en el state
             if(erroresArray.length > 0) {
                 Swal.fire({
                     title: 'Error',
                     text: erroresArray[0],
                     icon: 'error',
                     confirmButtonText: 'Aceptar'
                 })
             } else {
                 Swal.fire({
                     title: 'Error',
                     text: error2,
                     icon: 'error',
                     confirmButtonText: 'Aceptar'
                 })
             }
        }
    }

    const getAllRepertoriosByBandaId = async(bandaId) => {
        try {   
            const { data } = await alcompasAPI.get(`repertorios/banda/${bandaId}`);   
            const repertorios = data.repertorios;   
            return repertorios;
        } catch(error) {
            console.log("Error obteniendo los repertorios de la banda");
        }
    }

    return {
        crearRepertorio,
        getAllRepertoriosByBandaId
    }
}