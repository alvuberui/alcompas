import { alcompasAPI } from '../api';
import Swal from 'sweetalert2';

export const useObrasStore = () => {

    const crearObra = async(obraId, nuevaObra) => {
        try {
            nuevaObra.repertorio = obraId;
            const { data } = await alcompasAPI.post('obras/', nuevaObra);
            const obra = data.nuevaObra;
            return obra;
        } catch(error) {
            
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

    const getAllObrasByRepertorioId = async(repertorioId) => {
        try {
            const { data } = await alcompasAPI.get(`obras/repertorio/${repertorioId}`);
            const obras = data.obras;
            return obras;
        } catch(error) {
            console.log("Error obteniendo las obras del repertorio");
        }
    }

    

    return {
        getAllObrasByRepertorioId,
        crearObra
    }
}