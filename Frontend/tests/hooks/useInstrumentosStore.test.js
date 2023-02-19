import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { alcompasAPI } from '../../src/api';
import { useInstrumentosStore } from '../../src/hooks/useInstrumentosStore';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { authSlice } from '../../src/store/auth/authSlice';
import { instrumento1 } from '../fixtures/instrumentoFixtures';
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

describe('Pruebas en useInstrumentosStore', () => {

    test("Prueba obteniendo instrumentos de un usuario", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useInstrumentosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                instrumentos : [instrumento1]
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getInstrumentosByUserId('5f9f1b0b0b5b8c2b8c8c0b1c')

                expect(res).toEqual([instrumento1])
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteniendo instrumentos de un usuario", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useInstrumentosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getInstrumentosByUserId('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error cargando instrumentos');

                expect(logSpy).toHaveBeenCalledWith('Error cargando instrumentos');
            });
    
    });


    test("Prueba obteniendo instrumentos por la id", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useInstrumentosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                instrumento : instrumento1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getInstrumentosById('5f9f1b0b0b5b8c2b8c8c0b1c')

                expect(res).toEqual(instrumento1)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteniendo instrumentos por la id", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useInstrumentosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getInstrumentosById('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error cargando instrumento');

                expect(logSpy).toHaveBeenCalledWith('Error cargando instrumento');
            });
    
    });

    test("Prueba creando instrumento", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useInstrumentosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'post' ).mockReturnValue({
            data: {
                instrumentoGuardado : instrumento1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.crearInstrumentoUsuario(instrumento1)

                expect(res).toEqual(instrumento1)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa creando instrumento", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useInstrumentosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.crearInstrumentoUsuario('INVENTADO')
            });
            const { errores } = result.current;
            expect(errores).toEqual(['Error en el servidor']);
    
    });

    test("Prueba editanto instrumento", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useInstrumentosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'put' ).mockReturnValue({
            data: {
                instrumentoActualizado : instrumento1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.editarInstrumentoUsuario(instrumento1)

                expect(res).toEqual(instrumento1)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa creando instrumento", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useInstrumentosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.editarInstrumentoUsuario('INVENTADO')
            });
            const { errores } = result.current;
            expect(errores).toEqual(['Error en el servidor']);
    
    });

    test("Prueba eliminando instrumento", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useInstrumentosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'delete' ).mockReturnValue({
            data: {
                instrumento : instrumento1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.eliminarInstrumento('5f9f1b0b0b5b8c2b8c8c0b1c')

                expect(res).toEqual(instrumento1)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa eliminando instrumento", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useInstrumentosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.eliminarInstrumento('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error eliminando instrumento');

                expect(logSpy).toHaveBeenCalledWith('Error eliminando instrumento');
            });
    
    });

});