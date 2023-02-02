import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { alcompasAPI } from '../../src/api';
import { useMusicosStore } from '../../src/hooks/useMusicosStore';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { authSlice } from '../../src/store/auth/authSlice';
import { musico1 } from '../fixtures/musicoFixtures';
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

describe('Pruebas en useMusicosStore', () => {

    test("Prueba abandonando banda", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useMusicosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'put' ).mockReturnValue({
            data: {
                musicoDB : musico1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.abandonarBanda(musico1.banda, musico1.usuario)

                expect(res).toEqual(musico1)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa abandonando banda", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useMusicosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.abandonarBanda('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error finalizando músico');

                expect(logSpy).toHaveBeenCalledWith('Error finalizando músico');
            });
    
    });

    test("Prueba positiva obteniendo musicos de una banda", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useMusicosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                diccionario : {'Corneta': [musico1]}
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getMusicosBanda(musico1.banda)

                expect(res).toEqual({'Corneta': [musico1]})
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa abandonando banda", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useMusicosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getMusicosBanda('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error obteniendo músicos de la banda');

                expect(logSpy).toHaveBeenCalledWith('Error obteniendo músicos de la banda');
            });
    
    });

    test("Prueba finalizando musico", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useMusicosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'put' ).mockReturnValue({
            data: {
                musicoDB : musico1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.finalizarMusico(musico1.banda, musico1.usuario)

                expect(res).toEqual(musico1)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa finalizando musico", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useMusicosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.abandonarBanda('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error finalizando rol de musico');

                expect(logSpy).toHaveBeenCalledWith('Error finalizando rol de musico');
            });
    
    });

    test("Obteniendo musicos por usuarioId", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useMusicosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                musicos : [musico1]
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getMusicosByUserId(musico1.usuario)

                expect(res).toEqual([musico1])
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteninedo musicos por id", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useMusicosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getMusicosByUserId('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error obteniendo músicos del usuario');

                expect(logSpy).toHaveBeenCalledWith('Error obteniendo músicos del usuario');
            });
    
    });

    test("Obteniendo musicos por id", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useMusicosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                musico : musico1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getMusicoById(musico1._id)

                expect(res).toEqual(musico1)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteninedo musicos por id", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useMusicosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getMusicoById('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error obteniendo músico');

                expect(logSpy).toHaveBeenCalledWith('Error obteniendo músico');
            });
    
    });
});