import { configureStore } from '@reduxjs/toolkit';
import { act, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { BandaForm } from '../../../../src/modules/banda/pages/BandaForm';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { notAuthenticatedState } from '../../../fixtures/authFixtures';


jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => (fn) => fn(),
}));

jest.mock("sweetalert2", () => ({
    fire: jest.fn(),
}));

const store = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: authenticatedState2
    }
})



describe('Pruebas en el  <BandaForm />', () => {

    beforeEach(() => jest.clearAllMocks() );

    

    test('debe de mostrar el componente de PersonalRegsiter correctamente', async() => {

        act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <BandaForm />
                    </MemoryRouter>
                </Provider>
            );
        });

        await waitFor(() => {
            // Crear banda uno
            const btnSiguiente = screen.getByLabelText('link');
            expect( btnSiguiente ).not.toBe( undefined);
            btnSiguiente.click();

            // CrearBanda2
            const direccion = screen.getByLabelText('codigo');
            expect( direccion ).not.toBe( undefined);
            const boton = screen.getByLabelText('link');
            boton.click();

        });

        await waitFor(() => {

            // CrearBanda3
            const usuario = screen.getByLabelText('telefono');
            expect( usuario ).not.toBe( undefined);

        });
    });    
});