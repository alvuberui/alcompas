import { configureStore } from '@reduxjs/toolkit';
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Buscador } from '../../src/Components/Buscador';
import { NavbarInvitado } from '../../src/Components/NavbarInvitado';
import { useBandasStore } from '../../src/hooks';
import { authSlice } from '../../src/store/auth/authSlice';
import { notAuthenticatedState } from '../fixtures/authFixtures';
import { banda1 } from '../fixtures/bandaFixtures';



const storeAutenticado = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: notAuthenticatedState
    }
});


describe('Pruebas en el  <Buscador />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('Debe mostrar el componente correctamente', async() => {
        
        act(() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <NavbarInvitado />
                    </MemoryRouter>
                </Provider>
            );
        });
        
        const texto = screen.getByText('Crear Cuenta');
        expect( texto ).not.toBe( undefined);
        
    });
});