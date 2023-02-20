import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { alcompasAPI } from '../../src/api';
import { useDirectivosStore } from '../../src/hooks/useDirectivosStore';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { authSlice } from '../../src/store/auth/authSlice';
import { directivo1 } from '../fixtures/directivoFixtures';
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

describe('Pruebas en useDirectivosStore', () => {

    test("Prueba obteniendo directivo por id", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useDirectivosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                directivo : directivo1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getDirectivoById('63c9bae47a25636b0a55411f')

                expect(res).toEqual(directivo1)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteniendo directivo por id", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useDirectivosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getDirectivoById('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error cargando directivos');

                expect(logSpy).toHaveBeenCalledWith('Error cargando directivos');
            });
    
    });

    test("Prueba obteniendo directivo por userId", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useDirectivosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                directivo : [directivo1]
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getDirectivoByUserId('63c58bbdaf3c802189102e0e')

                expect(res).toEqual([directivo1])
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteniendo directivo por id", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useDirectivosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getDirectivoByUserId('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error cargando directivos');

                expect(logSpy).toHaveBeenCalledWith('Error cargando directivos');
            });
    
    });

    test("Prueba obteniendo directivo por bandaId", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useDirectivosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                diccionario : {'Presidente': [directivo1]}
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getDirectivosByBandaId('63c850f1f4f9246bd4ecb661')

                expect(res).toEqual({'Presidente': [directivo1]})
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteniendo directivo por id", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useDirectivosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getDirectivosByBandaId('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error cargando directivos');

                expect(logSpy).toHaveBeenCalledWith('Error cargando directivos');
            });
    
    });

    test("Prueba abandonando directivo", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useDirectivosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
        const directivoX = directivo1;
        directivoX.fecha_final = new Date();
        const spy = jest.spyOn( alcompasAPI, 'put' ).mockReturnValue({
            data: {
                directivoDB: directivoX
            }
            
        });
    
            await act(async() => {
                const res = await result.current.abandonarBandaDirectivo('63c850f1f4f9246bd4ecb661', '63c58bbdaf3c802189102e0e')

                expect(res).toEqual(directivoX);
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa abandonando directivo por id", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useDirectivosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getDirectivosByBandaId('INVENTADO', 'INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error finalizando directivo');

                expect(logSpy).toHaveBeenCalledWith('Error finalizando directivo');
            });
    
    });

    test("Prueba eliminando directivo", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useDirectivosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
        const directivoX = directivo1;
        directivoX.fecha_final = new Date();
        const spy = jest.spyOn( alcompasAPI, 'put' ).mockReturnValue({
            data: {
                directivoDB: directivoX
            }
            
        });
    
            await act(async() => {
                const res = await result.current.finalizarDirectivo('63c850f1f4f9246bd4ecb661', '63c58bbdaf3c802189102e0e')

                expect(res).toEqual(directivoX);
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa eliminando directivo por id", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useDirectivosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.finalizarDirectivo('INVENTADO', 'INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error finalizando rol de directivo');

                expect(logSpy).toHaveBeenCalledWith('Error finalizando rol de directivo');
            });
    
    });

    

    
});