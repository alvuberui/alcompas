import { configureStore } from '@reduxjs/toolkit';
import { act, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import {  useInstrumentosStore, useAuthStore } from '../../../../src/hooks';
import { AñadirInstrumentoModal } from '../../../../src/modules/user';
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
jest.mock('../../../../src/hooks/useInstrumentosStore');

describe('Pruebas en <AñadirEstudioModal />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user,
        });

        useInstrumentosStore.mockReturnValue({
            crearInstrumentoUsuario: jest.fn(),
            errores: [],
            setErrores: jest.fn(),
            getInstrumentosById: jest.fn().mockReturnValue( instrumento1 ),
            editarInstrumentoUsuario: jest.fn(),
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <AñadirInstrumentoModal open />
                    </MemoryRouter>
                </Provider>
            );
        });
        const texto = screen.getByText('Añadir Instrumento');
        expect( texto ).not.toBe( undefined);   
    });

    test('debe de mostrar el componente correctamente editando', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user,
        });

        useInstrumentosStore.mockReturnValue({
            crearInstrumentoUsuario: jest.fn(),
            errores: [],
            setErrores: jest.fn(),
            getInstrumentosById: jest.fn().mockReturnValue( instrumento1 ),
            editarInstrumentoUsuario: jest.fn(),
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <AñadirInstrumentoModal open editar={true}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        const texto = screen.getByText('Añadir Instrumento');
        expect( texto ).not.toBe( undefined);   
    });
});