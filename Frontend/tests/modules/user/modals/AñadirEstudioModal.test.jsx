import { configureStore } from '@reduxjs/toolkit';
import { act, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import {  useEstudiosStore, useAuthStore } from '../../../../src/hooks';
import { AñadirEstudioModal } from '../../../../src/modules/user';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { estudio1 } from '../../../fixtures/estudioFixture';

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
jest.mock('../../../../src/hooks/useEstudiosStore');

describe('Pruebas en <AñadirEstudioModal />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user,
        });

        useEstudiosStore.mockReturnValue({
            crearEstudio: jest.fn(),
            errores: [],
            setErrores: jest.fn(),
            getEstudioById: jest.fn().mockReturnValue( estudio1 ),
            editarEstudio: jest.fn(),
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <AñadirEstudioModal open />
                    </MemoryRouter>
                </Provider>
            );
        });
        const texto = screen.getByText('Añadir Estudio');
        expect( texto ).not.toBe( undefined);   
    });

    test('debe de mostrar el componente correctamente editando', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user,
        });

        useEstudiosStore.mockReturnValue({
            crearEstudio: jest.fn(),
            errores: [],
            setErrores: jest.fn(),
            getEstudioById: jest.fn().mockReturnValue( estudio1 ),
            editarEstudio: jest.fn(),
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <AñadirEstudioModal open editar={true}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        const texto = screen.getByText('Añadir Estudio');
        expect( texto ).not.toBe( undefined);   
    });
});