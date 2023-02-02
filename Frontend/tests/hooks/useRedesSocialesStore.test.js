import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { alcompasAPI } from '../../src/api';
import { useRedesSocialesStore } from '../../src/hooks';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { authSlice } from '../../src/store/auth/authSlice';
import { redSocial1 } from '../fixtures/redSocialFixtures';
import { authenticatedState2 } from '../fixtures/authFixtures';

const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer,
        },
        preloadedState: {
            auth: { ...initialState }
        }
    });
}

describe('Pruebas en useComentariosStore', () => {

    test("Prueba creando red social", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useRedesSocialesStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'post' ).mockReturnValue({
            data: {
                nuevaRedSocial : redSocial1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.crearRedSocial(redSocial1.banda,redSocial1)

                expect(res).toEqual(redSocial1)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteniendo comentarios de una banda", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useRedesSocialesStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.crearRedSocial(redSocial1.banda, redSocial1)
                
            });
            const { errores } = result.current;
            expect(errores).toEqual('Error creando la red social');
    
    });

    test("Obteniendo todas las redes de una banda", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useRedesSocialesStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                redes : [redSocial1]
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getAllByBandaId(redSocial1.banda)

                expect(res).toEqual([redSocial1])
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteniendo redes de una banda", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useRedesSocialesStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.crearRedSocial('INVENTADO');
                const logSpy = jest.spyOn(console, 'log');
                console.log('Error obteniendo las redes sociales de la banda');

                expect(logSpy).toHaveBeenCalledWith('Error obteniendo las redes sociales de la banda');
                
            });
    });

    test("Eliminado red social", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useRedesSocialesStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'delete' ).mockReturnValue({
            data: {
                red : redSocial1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.eliminarRedSocial(redSocial1._id)

                expect(res).toEqual(redSocial1)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteniendo redes de una banda", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useRedesSocialesStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.eliminarRedSocial('INVENTADO');
            });

            const { errores } = result.current;
            expect(errores).toEqual('Error eliminando la red social');
    });

    
});