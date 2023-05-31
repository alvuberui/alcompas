import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import {  useUploadsStore, useAuthStore } from '../../../../src/hooks';
import { EditarFoto } from '../../../../src/modules/user';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { instrumento1 } from '../../../fixtures/instrumentoFixtures';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => (fn) => fn(),
}));

const store = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: authenticatedState2
    }
})

jest.mock('../../../../src/hooks/useAuthStore');
jest.mock('../../../../src/hooks/useUploadsStore');

describe('Pruebas en <EditarFoto />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user,
        });

        useUploadsStore.mockReturnValue({
            editarFotoUsuario: jest.fn(),
            errores: [],
            setErrores: jest.fn(),
            editarFotoBanda: jest.fn(),
            getFotoPerfilUsuario: jest.fn().mockReturnValue( "" ),
            getFotoPerfilBanda: jest.fn().mockReturnValue( "" ),
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <EditarFoto open setFoto={jest.fn()} handleClose={jest.fn()}  setOpen={jest.fn()} tipo={"usuario"}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        await waitFor(() => {
            const texto = screen.getByText('AÑADIR FOTO');
            expect( texto ).not.toBe( undefined);  
            const boton = screen.getByLabelText('añadir'); 
            fireEvent.click( boton );
        });
    });

    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user,
        });

        useUploadsStore.mockReturnValue({
            editarFotoUsuario: jest.fn(),
            errores: [],
            setErrores: jest.fn(),
            editarFotoBanda: jest.fn(),
            getFotoPerfilUsuario: jest.fn().mockReturnValue( "" ),
            getFotoPerfilBanda: jest.fn().mockReturnValue( "" ),
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <EditarFoto open setFoto={jest.fn()} handleClose={jest.fn()}  setOpen={jest.fn()} tipo={"banda"}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        await waitFor(() => {
            const texto = screen.getByText('AÑADIR FOTO');
            expect( texto ).not.toBe( undefined);  
            const boton = screen.getByLabelText('añadir'); 
            fireEvent.click( boton );
        });
    });

    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user,
        });

        useUploadsStore.mockReturnValue({
            editarFotoUsuario: jest.fn(),
            errores: [],
            setErrores: jest.fn(),
            editarFotoBanda: jest.fn(),
            getFotoPerfilUsuario: jest.fn().mockReturnValue( "" ),
            getFotoPerfilBanda: jest.fn().mockReturnValue( "" ),
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <EditarFoto open setFoto={jest.fn()} handleClose={jest.fn()}  setOpen={jest.fn()} tipo={"bafsdsdnda"}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        await waitFor(() => {
            const texto = screen.getByText('AÑADIR FOTO');
            expect( texto ).not.toBe( undefined);  
            const boton = screen.getByLabelText('añadir'); 
            fireEvent.click( boton );
        });
    });
});