import { configureStore } from '@reduxjs/toolkit';
import { act, render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { useRedesSocialesStore, useComentariosStore, useAuthStore } from '../../../../src/hooks';
import { NuevoComentario } from '../../../../src/modules/banda/modals/NuevoComentario';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState2 } from '../../../fixtures/authFixtures';

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
jest.mock('../../../../src/hooks/useComentariosStore');

describe('Pruebas en <NuevoComentario />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user
        });

        useComentariosStore.mockReturnValue({
            errores: '',
            crearComentario: jest.fn(),
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <NuevoComentario open />
                    </MemoryRouter>
                </Provider>
            );
        });

        const texto = screen.getByText('Añadir comentario');
        expect( texto ).not.toBe( undefined);
    });

    test('Debe mostrar el error', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user
        });

        useComentariosStore.mockReturnValue({
            errores: 'Error',
            crearComentario: jest.fn(),
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <NuevoComentario open />
                    </MemoryRouter>
                </Provider>
            );
        });

        const texto = screen.getByText('Añadir comentario');
        expect( texto ).not.toBe( undefined);
        const boton = screen.getByLabelText('enviar');
        fireEvent.click( boton );
    });

    test('Si modal esta cerrado NO debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user
        });

        useComentariosStore.mockReturnValue({
            errores: 'Error',
            crearComentario: jest.fn(),
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <NuevoComentario open={false} />
                    </MemoryRouter>
                </Provider>
            ); 
        }); 
        waitFor(() => {
            const texto = screen.findAllByAltText('Añadir comentario');
      
            expect( texto ).toBe( new Object() ); 
        });
    });
});