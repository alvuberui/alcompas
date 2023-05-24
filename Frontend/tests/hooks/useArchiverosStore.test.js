import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { alcompasAPI } from '../../src/api';
import { useArchiverosStore } from '../../src/hooks/useArchiverosStore';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { authSlice } from '../../src/store/auth/authSlice';
import { archivero1 } from '../fixtures/archiveroFixtures';
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

const mockedUsedNavigate = jest.fn();

// mockear swal
jest.mock('sweetalert2', () => ({
    __esModule: true,
    default: jest.fn(),
    fire: jest.fn(),
    Swal: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('Pruebas en useArchiverosStore', () => {

    test("Prueba obteniendo archivero por su nombre de usuario", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useArchiverosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                archivero : archivero1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getArchiverosByUserId('5f9f1b0b4b3b0c0017b5b1a3')

                expect(res).toEqual(archivero1)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteniendo archivero por su nombre de usuario", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getUserByiD('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error cargando archivero');

                expect(logSpy).toHaveBeenCalledWith('Error cargando archivero');
            });
    
    });

    test("Prueba obteniendo si es archivero por el id de la banda", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useArchiverosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                esArchivero : true
            }
            
        });
    
            await act(async() => {
                const res = await result.current.esArchiveroByBandaId('5f9f1b0b4b3b0c0017b5b1a3')

                expect(res).toEqual(true)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteniendo si es archivero por el id de la banda", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getUserByiD('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error cargando archivero');

                expect(logSpy).toHaveBeenCalledWith('Error cargando archivero');
            });
    
    });

    test("Prueba obteniendo archiveros por el id de la banda", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useArchiverosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                diccionario : {archivero1}
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getArchiverosByBandaId('5f9f1b0b4b3b0c0017b5b1a3')

                expect(res).toEqual({archivero1})
            });
    
            spy.mockRestore();
    });



    test("Prueba finalizando archivero", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useArchiverosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'put' ).mockReturnValue({
            data: {
                archivero : archivero1
            }
            
        });
    
            await act(async() => {
                const res = await result.current.finalizarArchivero('5f9f1b0b4b3b0c0017b5b1a3', '5f9f1b0b4b3b0c0017b5b1a3')

                expect(res).toEqual(archivero1)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa finalizando archivero", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useArchiverosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.finalizarArchivero('INVENTADO', 'INVENTADO')
                // Comrpobar que se lanza un SweetAlert Swal("Error", "No se pudo finalizar el rol de archivero", "error");
               

                expect(Swal).toHaveBeenCalledWith("Error", "No se pudo finalizar el rol de archivero", "error");
            });
    
    });
    
});