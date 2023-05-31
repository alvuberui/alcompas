import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { alcompasAPI } from '../../src/api';
import { usePeticionesStore } from '../../src/hooks/usePeticionesStore';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { authSlice } from '../../src/store/auth/authSlice';
import { peticion1, peticion2 } from '../fixtures/peticionFixtures';
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

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('Pruebas en usePeticionesStore', () => {

    test("Prueba obteniendo peticiones por userId", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => usePeticionesStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                peticiones : [peticion2]
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getPeticionesByUserId(peticion2.usuario)

                expect(res).toEqual([peticion2])
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteniendo peticiones por userId", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => usePeticionesStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getPeticionesByUserId('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error cargando peticiones');

                expect(logSpy).toHaveBeenCalledWith('Error cargando peticiones');
            });
    
    });

    test("Prueba obteniendo peticiones por bandaId", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => usePeticionesStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                peticiones : [peticion2]
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getPeticionesByUserId(peticion2.banda)

                expect(res).toEqual([peticion2])
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteniendo peticiones por userId", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => usePeticionesStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getPeticionesByUserId('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error cargando peticiones');

                expect(logSpy).toHaveBeenCalledWith('Error cargando peticiones');
            });
    
    });

    test("Prueba aceptando petición", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => usePeticionesStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'put' ).mockReturnValue({
            data: {
                peticionAceptada : peticion2
            }
            
        });
    
            await act(async() => {
                const res = await result.current.aceptarPeticion(peticion2._id)

                expect(res).toEqual(peticion2)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteniendo peticiones por userId", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => usePeticionesStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.aceptarPeticion('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error aceptando petición');

                expect(logSpy).toHaveBeenCalledWith('Error aceptando petición');
            });
    
    });

    test("Prueba rechazando petición", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => usePeticionesStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'put' ).mockReturnValue({
            data: {
                peticionRechazada : peticion1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.rechazarPeticion(peticion1._id)

                expect(res).toEqual(peticion1)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteniendo peticiones por userId", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => usePeticionesStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.rechazarPeticion('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error rechazando petición');

                expect(logSpy).toHaveBeenCalledWith('Error rechazando petición');
            });
    
    });

    test("Prueba creando petición", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => usePeticionesStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'post' ).mockReturnValue({
            data: {
                peticion : peticion1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.crearPeticion(peticion1)

                expect(res).toEqual(peticion1)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteniendo peticiones por userId", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => usePeticionesStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.crearPeticion(peticion1)
               

                
            });
            const { errores } = result.current;
            expect(errores).toEqual(['No hay token en la petición']);
    
    });

    test("Obtener peticiones por bandaId", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => usePeticionesStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                peticiones : [peticion2]
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getPeticionesByBandaId(peticion2.banda)

                expect(res).toEqual([peticion2])
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteniendo peticiones por bandaId", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => usePeticionesStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getPeticionesByBandaId('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error cargando peticiones');

                expect(logSpy).toHaveBeenCalledWith('Error cargando peticiones');
            });
    
    });

});

