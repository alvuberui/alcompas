import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { alcompasAPI } from '../../src/api';
import { useEstudiosStore } from '../../src/hooks/useEstudiosStore';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { authSlice } from '../../src/store/auth/authSlice';
import { estudio1, estudio2 } from '../fixtures/estudioFixture';
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

describe('Pruebas en useEstudiosStore', () => {

    test("Prueba obteniendo estudios por usuario", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useEstudiosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                estudios : [estudio1]
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getEstudiosByUserId('63f23b7c574f95917e3595ff')

                expect(res).toEqual([estudio1])
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteniendo estudios de un usuario", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useEstudiosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getEstudiosByUserId('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error cargando estudios');

                expect(logSpy).toHaveBeenCalledWith('Error cargando estudios');
            });
    });

    test("Prueba positiva eliminando estudio", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useEstudiosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'delete' ).mockReturnValue({
            data: {
                estudio : estudio1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.eliminarEstudio(estudio1._id)

                expect(res).toEqual(estudio1)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa elminando estudio", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useEstudiosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.eliminarEstudio('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error eliminando estudio');

                expect(logSpy).toHaveBeenCalledWith('Error eliminando estudio');
            });
    });

    test("Prueba positiva creando estudio", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useEstudiosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'post' ).mockReturnValue({
            data: {
                estudio : estudio1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.crearEstudio(estudio1)

                expect(res).toEqual(estudio1)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa creando estudio", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useEstudiosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.crearEstudio(estudio2)
                
            });
            const { errores } = result.current;
            expect(errores).toEqual(["Error en el servidor"]);

            
    });

    test("Prueba positiva editando estudio", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useEstudiosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'put' ).mockReturnValue({
            data: {
                estudioActualizado : estudio1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.editarEstudio(estudio1, "63f23b7c574f95917e3595ff", estudio1._id)

                expect(res).toEqual(estudio1)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa  creando estudio", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useEstudiosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.crearEstudio(estudio2, 'inventado')
                
            });
            const { errores } = result.current;
            expect(errores).toEqual(["Error en el servidor"]);

            
    });

    test("Prueba obteniendo estudios por id", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useEstudiosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                estudio : estudio1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getEstudioById('63c58bbdaf3c802189102e0e')

                expect(res).toEqual(estudio1)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteniendo estudios de un usuario", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useEstudiosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getEstudioById('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error cargando estudio');

                expect(logSpy).toHaveBeenCalledWith('Error cargando estudio');
            });
    });

});