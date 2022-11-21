import { useDispatch, useSelector } from 'react-redux';
import { alcompasAPI} from '../api';
import { useAuthStore } from './';

export const usePeticionesStore = () => {

    const { user } = useAuthStore();
    const getPeticionesByUserId = async(userId) => {
        try {
            const { data } = await alcompasAPI.get('peticiones/' + userId);
            const peticiones = data.peticiones;
            
            return peticiones;
        } catch(error) {
            console.log('Error cargando peticiones');
            console.log(error)
        }
    }

    const aceptarPeticion = async(peticionId) => {
        try {
            const { data } = await alcompasAPI.put('peticiones/aceptar/' +peticionId+ "/" + user.uid);

        } catch(error) {
            console.log('Error aceptando petición');
            console.log(error)
        }
    }

    const rechazarPeticion = async(peticionId) => {
        try {
            const { data } = await alcompasAPI.put('peticiones/rechazar/' +peticionId+ "/" + user.uid);

        } catch(error) {
            console.log('Error rechazando petición');
            console.log(error)
        }
    }

    return {
        // Métodos
        getPeticionesByUserId,
        aceptarPeticion,
        rechazarPeticion
    }
}