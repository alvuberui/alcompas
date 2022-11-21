import { useDispatch, useSelector } from 'react-redux';
import { alcompasAPI} from '../api';

export const useBandasStore = () => {

    const getBandaById = async(bandaId) => {
        try {
            const { data } = await alcompasAPI.get('bandas/' + bandaId);
            const banda = data.banda;
            
            return banda;
        } catch(error) {
            console.log('Error cargando peticiones');
            console.log(error)
        }
    }

    return {
        // Métodos
        getBandaById,
    }
}