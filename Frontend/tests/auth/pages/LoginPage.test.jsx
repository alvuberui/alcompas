import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from '../../../src/auth/pages/LoginPage';
import { useAuthStore } from '../../../src/hooks/useAuthStore';
import { authSlice } from '../../../src/store/auth/authSlice';
import { notAuthenticatedState } from '../../fixtures/authFixtures';

const mockStartLogin = jest.fn();

jest.mock('../../../src/hooks/useAuthStore');


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



describe('Pruebas en <LoginPage />', () => {

    beforeEach(() => jest.clearAllMocks() );


    test('debe de mostrar el componente correctamente', () => {

        useAuthStore.mockReturnValue({
            startLogin: mockStartLogin,
        });

        const email = "test@test.com";
        const contraseña = "123456";

        render(
            <Provider store={ store }>
                <MemoryRouter>
                    <LoginPage />
                </MemoryRouter>
            </Provider>
        );
        expect( screen.getByLabelText('link')).not.toBe( undefined);

        const emailField = screen.getByLabelText("correo");
        fireEvent.change( emailField, { target: { name: 'email', defaultValue: email } });
        
        const passwordField = screen.getByLabelText('contraseña');
        fireEvent.change( passwordField, { target: { name: 'loginContraseña', defaultValue: contraseña } });
        
        const loginForm = screen.getByLabelText('submit');
        fireEvent.submit( loginForm );

        
        expect( mockStartLogin ).toHaveBeenCalled();
    });
});