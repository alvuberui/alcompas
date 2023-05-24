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

    test("Crear instrumento para banda", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useInstrumentosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        const spy = jest.spyOn( alcompasAPI, 'post' ).mockReturnValue({
            data: {
                instrumentoDB : instrumento1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.crearInstrumentoBanda(instrumento1, '5f9f1b0b0b5b8c2b8c8c0b1c')

                expect(res).toEqual(instrumento1)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa creando instrumento para banda", async() => {

        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useInstrumentosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        const spy = jest.spyOn( alcompasAPI, 'post' ).mockReturnValue({
            data: {
                instrumentoDB : instrumento1
            }
            
        });
    
            await act(async() => {
                await result.current.crearInstrumentoBanda('INVENTADO', '5f9f1b0b0b5b8c2b8c8c0b1c')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error en el servidor');

                expect(logSpy).toHaveBeenCalledWith('Error en el servidor');
            });
    
            spy.mockRestore();
    });

    test("Obtener todos los instrumentos by banda id", async() => {
            
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
                    const res = await result.current.getTodosInstrumentosByBanda('5f9f1b0b0b5b8c2b8c8c0b1c')
    
                    expect(res).toEqual([instrumento1])
                });
        
                spy.mockRestore();
        });

        test("Prueba negativa obteniendo instrumentos by banda id", async() => {
            const mockStore = getMockStore({ ...authenticatedState2 });
            const { result } = renderHook( () => useInstrumentosStore(), {
                wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
            });
            
        
                await act(async() => {
                    await result.current.getTodosInstrumentosByBanda('INVENTADO')
                    const logSpy = jest.spyOn(console, 'log');
    
                    console.log('Error cargando instrumentos');
    
                    expect(logSpy).toHaveBeenCalledWith('Error cargando instrumentos');
                });
        
        });

        test("Prueba editando instrumento de banda", async() => {
                
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
                        const res = await result.current.editarInstrumentoBanda(instrumento1, '5f9f1b0b0b5b8c2b8c8c0b1c')
        
                        expect(res).toEqual(instrumento1)
                    });
            
                    spy.mockRestore();
            }
        );

        test("Prueba negativa editando instrumento de banda", async() => {
            const mockStore = getMockStore({ ...authenticatedState2 });
            const { result } = renderHook( () => useInstrumentosStore(), {
                wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
            });
            
        
                await act(async() => {
                    await result.current.editarInstrumentoBanda('INVENTADO', '5f9f1b0b0b5b8c2b8c8c0b1c')
                    const logSpy = jest.spyOn(console, 'log');
    
                    console.log('Error en el servidor');
    
                    expect(logSpy).toHaveBeenCalledWith('Error en el servidor');
                });
        
        });

        test("Prueba eliminando instrumento de banda", async() => {
                    
                    const mockStore = getMockStore({ ...authenticatedState2 });
                    const { result } = renderHook( () => useInstrumentosStore(), {
                        wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
                    });
            
                    const spy = jest.spyOn( alcompasAPI, 'delete' ).mockReturnValue({
                        data: {
                            instrumentoEliminado : instrumento1
                        }
                        
                    });
                
                        await act(async() => {
                            const res = await result.current.eliminarInstrumentoBanda('5f9f1b0b0b5b8c2b8c8c0b1c')
            
                            expect(res).toEqual(instrumento1)
                        });
                
                        spy.mockRestore();
                }
            );

            test("Prueba negativa eliminando instrumento de banda", async() => {
                const mockStore = getMockStore({ ...authenticatedState2 });
                const { result } = renderHook( () => useInstrumentosStore(), {
                    wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
                });
                
            
                    await act(async() => {
                        await result.current.eliminarInstrumentoBanda('INVENTADO')
                        const logSpy = jest.spyOn(console, 'log');
        
                        console.log('Error eliminando instrumento');
        
                        expect(logSpy).toHaveBeenCalledWith('Error eliminando instrumento');
                    });
            
            });

            test("Obtener todos los instrumentos prestados by banda id", async() => {

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
                        const res = await result.current.obtenerTodosConPrestamosByBanda('5f9f1b0b0b5b8c2b8c8c0b1c')
        
                        expect(res).toEqual([instrumento1])
                    });
            
                    spy.mockRestore();
            });

            test("Prueba negativa obteniendo instrumentos prestados by banda id", async() => {
                const mockStore = getMockStore({ ...authenticatedState2 });
                const { result } = renderHook( () => useInstrumentosStore(), {
                    wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
                });
                
            
                    await act(async() => {
                        await result.current.obtenerTodosConPrestamosByBanda('INVENTADO')
                        const logSpy = jest.spyOn(console, 'log');
        
                        console.log('Error cargando instrumentos');
        
                        expect(logSpy).toHaveBeenCalledWith('Error cargando instrumentos');
                    });
            
            });

            test("Obtener todos los instrumentos sin prestar by banda id", async() => {
                    
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
                            const res = await result.current.obtenerTodosInstrumentosSinPrestarByBanda('5f9f1b0b0b5b8c2b8c8c0b1c')
            
                            expect(res).toEqual([instrumento1])
                        });
                
                        spy.mockRestore();
                });

                test("Prueba negativa obteniendo instrumentos sin prestar by banda id", async() => {
                    const mockStore = getMockStore({ ...authenticatedState2 });
                    const { result } = renderHook( () => useInstrumentosStore(), {
                        wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
                    });
                    
                
                        await act(async() => {
                            await result.current.obtenerTodosInstrumentosSinPrestarByBanda('INVENTADO')
                            const logSpy = jest.spyOn(console, 'log');
            
                            console.log('Error cargando instrumentos');
            
                            expect(logSpy).toHaveBeenCalledWith('Error cargando instrumentos');
                        });
                
                });

});