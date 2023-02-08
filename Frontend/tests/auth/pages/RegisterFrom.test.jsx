import { configureStore } from '@reduxjs/toolkit';
import { act, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { RegisterFrom } from '../../../src/auth/pages/RegisterFrom';
import { authSlice } from '../../../src/store/auth/authSlice';
import { notAuthenticatedState } from '../../fixtures/authFixtures';


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
        auth: notAuthenticatedState
    }
})



describe('Pruebas en el  <RegisterFrom />', () => {

    beforeEach(() => jest.clearAllMocks() );

    

    test('debe de mostrar el componente de PersonalRegsiter correctamente', async() => {

        act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <RegisterFrom />
                    </MemoryRouter>
                </Provider>
            );
        });

        await waitFor(() => {
            // PersonalRegister
            const btnSiguiente = screen.getByLabelText('link');
            expect( btnSiguiente ).not.toBe( undefined);
            btnSiguiente.click();

            // LocationRegister
            const direccion = screen.getByLabelText('direccion');
            expect( direccion ).not.toBe( undefined);
            const boton = screen.getByLabelText('link');
            boton.click();

        });

        await waitFor(() => {

            // UserRegister
            const usuario = screen.getByLabelText('usuario');
            expect( usuario ).not.toBe( undefined);
            const otroBoton = screen.getByLabelText('siguiente');
            otroBoton.click();

        });

        await waitFor(() => {

            // Confirmation Register
            const nif = screen.getByLabelText('nif');
            expect( nif ).not.toBe( undefined);
            
        });
    });    
});