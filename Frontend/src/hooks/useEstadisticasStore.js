import { alcompasAPI } from '../api';

export const useEstadisticasStore = () => {


    // Obtener las mas contratadas
    const getBandasConMasContratos = async() => {
        try {
            const { data } = await alcompasAPI.get('estadisticas/contratos');
            const bandas = data.bandas;
            return bandas;
        } catch(error) {
            console.log('Error cargando bandas');
        }
    }

    // Obtener las mas contratadas semana santa
    const getBandasConMasContratosSemanaSanta = async() => {
        try {
            const { data } = await alcompasAPI.get('estadisticas/contratos/semana-santa');
            const bandas = data.bandas;
            return bandas;
        } catch(error) {
            console.log('Error cargando bandas');
        }
    }

    // Obtener las mas populares
    const getBandasPopulares = async() => {
        try {
            const { data } = await alcompasAPI.get('estadisticas/likes');
            const bandas = data.bandas;
            return bandas;
        } catch(error) {
            console.log('Error cargando bandas');
        }
    }

    return {
        getBandasConMasContratos,
        getBandasConMasContratosSemanaSanta,
        getBandasPopulares
    }
}