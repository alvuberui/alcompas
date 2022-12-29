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

    const abandonarBandaDirectivo = async(bandaId, usuarioId) => {
        try {
            const { data } = await alcompasAPI.put('directivos/finalizar/' + usuarioId + '/' + bandaId);
            const directivo = data.directivoDB;
            
            return directivo;
        } catch(error) {
            console.log('Error finalizando directivo');
        }
    }

    return {
        // Métodos
        getDirectivoById,
        getDirectivoByUserId,
        abandonarBandaDirectivo
    }
}