import { useDispatch, useSelector } from 'react-redux';
import { alcompasAPI} from '../api';

export const useMusicosStore = () => {

    const abandonarBanda = async(bandaId, usuarioId) => {
        try {
            const { data } = await alcompasAPI.put('musicos/finalizar/' + usuarioId + '/' + bandaId);
            const musico = data.musicoDB;
            
            return musico;
        } catch(error) {
            console.log(error);
            console.log('Error finalizando músico');
        }
    }

    const getMusicosBanda = async(bandaId) => {
        try {
            const { data } = await alcompasAPI.get('musicos/byAllByBandaId/' + bandaId);
            const musicos = data.diccionario;
            return musicos;
        }
        catch(error) {
            console.log('Error obteniendo músicos de la banda');
        }
    }


    return {
        // Métodos
        abandonarBanda,
        getMusicosBanda
    }
}