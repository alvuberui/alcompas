import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { initialState, notAuthenticatedState, authenticatedState, authenticatedState2 } from '../fixtures/authFixtures';
import { authSlice } from '../../src/store/auth/authSlice';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { testUserCredentials, testUserCredentials2 } from '../fixtures/testUser';
import { alcompasAPI } from '../../src/api';

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

describe('Pruebas en useAuthStore', () => {

    beforeEach(() => localStorage.clear() );

    test('debe de regresar los valores por defecto', () => {
        
        const mockStore = getMockStore({...initialState });

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        expect(result.current).toEqual({
            errorMessage: undefined,
            status: 'checking',
            user: {},
            checkAuthToken: expect.any(Function),
            startLogin: expect.any(Function),
            startLogout: expect.any(Function),
            startRegister: expect.any(Function),
            deleteAdminById: expect.any(Function),
            getAllUsers : expect.any(Function),
            getUserByUsername: expect.any(Function),
            getUserByiD: expect.any(Function),
            startDelete:    expect.any(Function),
            startUpdate:    expect.any(Function),
            startUpdatePassword: expect.any(Function),
        });
    });

    test('startLogin debe de realizar el login incorrectamente', async() => {
        
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        await act(async() => {
            await result.current.startLogin( testUserCredentials )
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Credenciales incorrectas',
            status: "no-autenticado",
            user: {}
        });
    });

    test('startLogin debe de realizar el login correctamente', async() => {
        
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        await act(async() => {
            await result.current.startLogin( testUserCredentials2 )
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'autenticado',
            user: { nombre: 'Álvaro', uid: '63efa3b862b6fc7b8a318e68' }
        });

        expect( localStorage.getItem('token') ).toEqual( expect.any(String) );
        expect( localStorage.getItem('token-init-date') ).toEqual( expect.any(String) );    
    });

    test('startRegister debe de crear un usuario', async() => {

        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        const spy = jest.spyOn( alcompasAPI, 'post' ).mockReturnValue({
            data: {
                ok: true,
                uid: '62a10a4954e8230e568a49ab',
                nombre: 'Fernando',
                token: 'ALGUN-TOKEN'
            }
        });

        await act(async() => {
            await result.current.startRegister(testUserCredentials)
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'autenticado',
            user: { nombre: 'Fernando', uid: '62a10a4954e8230e568a49ab' }
        });

        spy.mockRestore();
    });

    test('startRegister debe de fallar la creación', async() => {
        
        const mockStore = getMockStore({ ...notAuthenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        await act(async() => {
            await result.current.startRegister(testUserCredentials2)
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Un usuario existe con ese correo',
            status: 'no-autenticado',
            user: {}
        });
    });

    test('checkAuthToken debe de fallar si no hay token', async() => {
        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        await act(async() => {
            await result.current.checkAuthToken()
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'no-autenticado',
            user: {}
        });


    });

    test('checkAuthToken debe de autenticar el usuario si hay un token', async() => {
        
        const { data } = await alcompasAPI.post('/auth', testUserCredentials2 );
        localStorage.setItem('token', data.token );

        const mockStore = getMockStore({ ...initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        await act(async() => {
            await result.current.checkAuthToken()
        });

        const { errorMessage, status, user } = result.current;
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'autenticado',
            user: { nombre: 'Álvaro', uid: '63efa3b862b6fc7b8a318e68' }
        });
    });

    test('Prueba positiva en startUpdate', async() => {
        const mockStore = getMockStore({ ...authenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        const spy = jest.spyOn( alcompasAPI, 'put' ).mockReturnValue({
            data: {
                ok: true,
                uid: '62a10a4954e8230e568a49ab',
                nombre: 'Fernando',
                token: 'ALGUN-TOKEN'
            }
        });

        await act(async() => {
            await result.current.startUpdate(testUserCredentials2)
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: "",
            status: 'autenticado',
            user: { nombre: 'Fernando', uid: '62a10a4954e8230e568a49ab' }
        });

        spy.mockRestore();
    });

    test('Prueba negativa en startUpdate', async() => {
        const mockStore = getMockStore({ ...authenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        
        const u = testUserCredentials2;
        u.nif = '1'
        await act(async() => {
            await result.current.startUpdate(u)
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: "El nif nos es válido",
            status: 'autenticado',
            user: { nombre: 'Fernando', uid: '62a10a4954e8230e568a49ab' }
        });
    });


    test('Prueba positiva en actualizar contraseña', async() => {
        const mockStore = getMockStore({ ...authenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

        const spy = jest.spyOn( alcompasAPI, 'put' ).mockReturnValue({
            data: {
                usuarioModificado: {
                ok: true,
                uid: '62a10a4954e8230e568a49ab',
                nombre: 'Fernando',
                token: 'ALGUN-TOKEN',
                contraseña: 'nuevaContraseña'
                }
            }
        });
        let res = {}
        await act(async() => {
            res = await result.current.startUpdatePassword("nuevaContraseña");
        });
        expect(res.contraseña).toBe('nuevaContraseña');

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'autenticado',
            user: { nombre: 'Fernando', uid: '62a10a4954e8230e568a49ab' }
        });

        spy.mockRestore();
    });

    test('Prueba negativa en actualizar contraseña', async() => {
        const mockStore = getMockStore({ ...authenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });

           ;
        let res = {}
        await act(async() => {
            res = await result.current.startUpdatePassword("n");
        });

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'La contraseña debe de contener mínimo 7 caracteres y máximo 200',
            status: 'autenticado',
            user: { nombre: 'Fernando', uid: '62a10a4954e8230e568a49ab' }
        });

    });

    test("Prueba positiva eliminando usuario", async() => {
        const mockStore = getMockStore({ ...authenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
    
        const spy = jest.spyOn( alcompasAPI, 'delete' ).mockReturnValue({
            data: {
                ok: true,
                uid: '62a10a4954e8230e568a49ab',
                nombre: 'Fernando',
                token: 'ALGUN-TOKEN'
            }
        });
    
            await act(async() => {
                await result.current.startDelete(testUserCredentials)
            });
    
            const { errorMessage, status, user } = result.current;

            expect({ errorMessage, status, user }).toEqual({
                errorMessage: undefined,
                status: 'no-autenticado',
                user: {  }
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa eliminando mi usuario", async() => {
        const mockStore = getMockStore({ ...authenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
        
    
            await act(async() => {
                await result.current.startDelete('INVENTADO')
                const { errorMessage, status, user } = result.current;
                expect({ errorMessage, status, user }).toEqual({
                    errorMessage: undefined,
                    status: 'autenticado',
                    user: {
                        nombre: 'Fernando',
                        uid: "62a10a4954e8230e568a49ab"
                    }
                });
        
            });
    
    });

    test("Prueba positiva eliminando usuario siendo un administrador", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
    
        const spy = jest.spyOn( alcompasAPI, 'delete' ).mockReturnValue({
            data: {
                ok: true,
                uid: '62a10a4954e8230e568a49ab',
                nombre: 'Fernando',
                token: 'ALGUN-TOKEN'
            }
        });
    
            await act(async() => {
                await result.current.deleteAdminById(testUserCredentials)
            });
    
            const { errorMessage, status, user } = result.current;

            expect({ errorMessage, status, user }).toEqual({
                errorMessage: undefined,
                status: 'autenticado',
                user: { nombre:'Álvaro', uid: '63efa3b862b6fc7b8a318e68' }
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa eliminando un usuario como administrador", async() => {
        const mockStore = getMockStore({ ...authenticatedState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.deleteAdminById('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error eliminando usuario');

                expect(logSpy).toHaveBeenCalledWith('Error eliminando usuario');
            });
    
    });

    test("Prueba positiva cerrando sesión", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
    
    
            await act(async() => {
                await result.current.startLogout()
            });
    
            const { errorMessage, status, user } = result.current;

            expect({ errorMessage, status, user }).toEqual({
                errorMessage: undefined,
                status: 'no-autenticado',
                user: {}
            });
    });

    test("Prueba obteniendo usuario por su id", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
    
        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                usuario : testUserCredentials2
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getUserByiD('63c58bbdaf3c802189102e0e')

                expect(res).toEqual(testUserCredentials2)
            });
    
            spy.mockRestore();
    });

    test("Prueba obteniendo usuario por su id", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
    
        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                usuario : testUserCredentials2
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getUserByiD('63c58bbdaf3c802189102e0e')

                expect(res).toEqual(testUserCredentials2)
            });
    
            spy.mockRestore();
    });

    test("Prueba obteniendo usuario por su id", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                usuario : testUserCredentials2
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getUserByiD('63c58bbdaf3c802189102e0e')

                expect(res).toEqual(testUserCredentials2)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteniendo usuario por su id", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getUserByiD('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error cargando usuario');

                expect(logSpy).toHaveBeenCalledWith('Error cargando usuario');
            });
    
    });


    test("Prueba obteniendo todos los usuarios", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
        const usuarios = [testUserCredentials, testUserCredentials2]
        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                usuarios : usuarios
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getAllUsers()

                expect(res).toEqual(usuarios)
            });
    
            spy.mockRestore();
    });

    test("Prueba obteniendo un usuario por su nombre de usuario", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        

        const spy = jest.spyOn( alcompasAPI, 'get' ).mockReturnValue({
            data: {
                usuario : testUserCredentials2
            }
            
        });
    
            await act(async() => {
                const res = await result.current.getUserByUsername('alvaro_ubeda8')

                expect(res).toEqual(testUserCredentials2)
            });
    
            spy.mockRestore();
    });

    test("Prueba negativa obteniendo usuario por su nombre de usuario", async() => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getUserByUsername('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error cargando usuario');

                expect(logSpy).toHaveBeenCalledWith('Error cargando usuario');
            });
    
    });

    



});