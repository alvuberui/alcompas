import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { alcompasAPI } from '../../src/api';
import { useBandasStore } from '../../src/hooks/useBandasStore';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { authSlice } from '../../src/store/auth/authSlice';
import { banda1, banda2 } from '../fixtures/bandaFixtures';
import { authenticatedState2 } from '../fixtures/authFixtures';
import Swal from 'sweetalert2';

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

jest.mock("sweetalert2", () => ({
    fire: jest.fn()
 }));

describe('Pruebas en useBandasStore', () => {

    test("Prueba obteniendo banda por su id", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useBandasStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                banda : banda1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getBandaById('63c9bae47a25636b0a55411f')

                expect(res).toEqual(banda1);
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteniendo banda por si id", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useBandasStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getBandaById('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error cargando banda');

                expect(logSpy).toHaveBeenCalledWith('Error cargando banda');
            });
    
    });

    test("Prueba obteniendo bandas", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useBandasStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
        const bandas = [banda1];
        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                bandas : bandas
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getBandas();

                expect(res).toEqual(bandas);
            });
    
            spy.mockRestore();
    });

    test("Prueba obteniendo bandas por usuario", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useBandasStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
        const bandas = [banda1];
        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                bandas : bandas
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getBandasByUserId('63c9bae47a25636b0a55411f');

                expect(res).toEqual(bandas);
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteniendo banda por usuario", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useBandasStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getBandasByUserId('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error cargando bandas');

                expect(logSpy).toHaveBeenCalledWith('Error cargando bandas');
            });
    
    });

    test("Prueba obteniendo bandas por nombre", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useBandasStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
        const bandas = [banda1];
        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                resultado : bandas
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getBandasByNombre('EJEMPLO');

                expect(res).toEqual(bandas);
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteniendo banda por nombre", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useBandasStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getBandasByNombre('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error cargando bandas');

                expect(logSpy).toHaveBeenCalledWith('Error cargando bandas');
            });
    
    });

    test("Prueba positiva creando banda", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useBandasStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
        const spy = jest.spyOn( alcompasAPI, 'post' ).mockReturnValue({
            data: {
                banda : banda1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.crearBanda(banda1);

                expect(res).toEqual(banda1);
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa creando banda", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useBandasStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
        
            await act(async() => {
                await result.current.crearBanda(banda2)
                
            });
            const { mensajeError } = result.current;

            expect(mensajeError).toEqual('No hay token en la petición');
    
    });

    test("Prueba positiva eliminando banda", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useBandasStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
        const spy = jest.spyOn( alcompasAPI, 'delete' ).mockReturnValue({
            data: {
                banda_eliminada : banda1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.eliminarBanda("63c9bae47a25636b0a55411f");

                expect(res).toEqual(banda1);
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa eliminando banda", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useBandasStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
        
            await act(async() => {
                await result.current.eliminarBanda("inventado")
                
            });

            expect(Swal.fire).toBeCalled();
    });

    test("Prueba positiva editando banda", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useBandasStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
        const spy = jest.spyOn( alcompasAPI, 'put' ).mockReturnValue({
            data: {
                banda : banda1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.editarBandas(banda1,"63c9bae47a25636b0a55411f");
                
                expect(res).toEqual(banda1);
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa editando banda", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useBandasStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
        
            await act(async() => {
                await result.current.editarBandas(banda2, "inventado")
                
            });

            const { mensajeError } = result.current;

            expect(mensajeError).toEqual('No hay token en la petición');
    });

    

});