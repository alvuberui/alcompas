
import { alcompasAPI } from '../api';

export const useMusicosStore = () => {

    const abandonarBanda = async(bandaId, usuarioId) => {
        try {
            const { data } = await alcompasAPI.put('musicos/finalizar/' + usuarioId + '/' + bandaId);
            const musico = data.musicoDB;
            
            return musico;
        } catch(error) {
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

    const finalizarMusico = async(userId, bandaId) => {
        try {
            const { data } = await alcompasAPI.put('musicos/finalizar/' + userId +'/' + bandaId);
            const musico = data.musicoDB;
            return musico;
        }
        catch(error) {
            console.log('Error finalizando rol de musico');
        }
    }

    const getMusicosByUserId = async(userId) => {
        try {
           
            const { data } = await alcompasAPI.get('musicos/user/id/' + userId);
            const musicos = data.musicos;
            return musicos;
        }
        catch(error) {
            console.log('Error obteniendo músicos del usuario');
        }
    }

    const getMusicoById = async(musicoId) => {
        try {
            const { data } = await alcompasAPI.get('musicos/' + musicoId);
            const musico = data.musico;
            
            return musico;
        }
        catch(error) {
           
            console.log('Error obteniendo músico');
        }
    }

    const getMusicosByIntrumentoAndLocalidad = async(instrumento, localidad) => {
        try {
            const { data } = await alcompasAPI.get('musicos/instrumento/' + instrumento + '/localidad/' + localidad);
            const musicos = data.musicosFiltrados;
            return musicos;
        }
        catch(error) {
            console.log('Error obteniendo músicos');
        }
    }


    return {
        // Métodos
        abandonarBanda,
        getMusicosBanda,
        finalizarMusico,
        getMusicoById,
        getMusicosByUserId,
        getMusicosByIntrumentoAndLocalidad
    }
}