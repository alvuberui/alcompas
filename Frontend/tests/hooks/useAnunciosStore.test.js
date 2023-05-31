import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { alcompasAPI } from '../../src/api';
import { useAnunciosStore } from '../../src/hooks';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { authSlice } from '../../src/store/auth/authSlice';
import { archivero1 } from '../fixtures/archiveroFixtures';
import { noticia1 } from '../fixtures/anuncioFixtures';
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

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
}))


describe('Pruebas en useAnunciosStore', () => {

    test("Prueba creando anuncio", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useAnunciosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'post' ).mockReturnValue({
            data: {
                anuncioDB : noticia1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.crearAnuncio(noticia1)

                expect(res).toEqual(noticia1)
            });
    
            spy.mockRestore();
    });

    test("Prueba obteniendo publicas", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useAnunciosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                anuncios : [noticia1]
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getAllPublicas()

                expect(res).toEqual([noticia1])
            });
    
            spy.mockRestore();
    });

    test("Obtener noticias de una banda", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useAnunciosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                anuncios : [noticia1]
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getNoticiasByBanda("5f9f1b0b4b3b0c0017b5b1a3")

                expect(res).toEqual([noticia1])
            });
    
            spy.mockRestore();
    });

    test("Eliminar noticia", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useAnunciosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'delete' ).mockReturnValue({
            data: {
                anuncio : noticia1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.deleteNoticia("5f9f1b0b4b3b0c0017b5b1a3")

                expect(res).toEqual(noticia1)
            });
    
            spy.mockRestore();
    });
});