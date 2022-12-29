import { useDispatch, useSelector } from 'react-redux';
import { alcompasAPI} from '../api';

export const useDirectivosStore = () => {

    const getDirectivoById = async(directivoId) => {
        try {
            const { data } = await alcompasAPI.get('directivos/' + directivoId);
            const directivo = data.directivo;
            
            return directivo;
        } catch(error) {
            console.log('Error cargando directivos');
        }
    }

    const getDirectivoByUserId = async(userId) => {
        try {
            const { data } = await alcompasAPI.get('directivos/byUserId/' + userId);
            const directivo = data.directivo;
            
            return directivo;
        } catch(error) {
            console.log('Error cargando directivos');
        }
    }

    return {
        // Métodos
        getDirectivoById,
        getDirectivoByUserId
    }
}