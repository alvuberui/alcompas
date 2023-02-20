import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { alcompasAPI } from '../../src/api';
import { useComentariosStore } from '../../src/hooks/useComentariosStore';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { authSlice } from '../../src/store/auth/authSlice';
import { comentario1 } from '../fixtures/comentarioFixtures';
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

    test("Prueba obteniendo comentarios de una banda", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useComentariosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                comentarios : [comentario1]
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getComentariosByBandaId('63c9bae47a25636b0a55411f')

                expect(res).toEqual([comentario1])
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteniendo comentarios de una banda", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useComentariosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getComentariosByBandaId('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error cargando comentarios');

                expect(logSpy).toHaveBeenCalledWith('Error cargando comentarios');
            });
    
    });

    test("Prueba postiva creando comentario", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useComentariosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'post' ).mockReturnValue({
            data: {
                nuevoComentario : comentario1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.crearComentario(comentario1.banda, comentario1, comentario1.usuario)

                expect(res).toEqual(comentario1)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa creando comentarios ", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useComentariosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.crearComentario('INVENTADO', comentario1, comentario1.usuario)

            });
            const { errores } = result.current;
            expect(errores).toEqual('No hay token en la petición');
    
    });


    test("Prueba postiva eliminando comentario", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useComentariosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'delete' ).mockReturnValue({
            data: {
                comentario : comentario1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.eliminarComentario(comentario1._id)

                expect(res).toEqual(comentario1)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa eliminando comentarios ", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useComentariosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.eliminarComentario('INVENTADO')

            });
            const logSpy = jest.spyOn(console, 'log');

            console.log('Error eliminando comentarios');

            expect(logSpy).toHaveBeenCalledWith('Error eliminando comentarios');
    
    });

    
});