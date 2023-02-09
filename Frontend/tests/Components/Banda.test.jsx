import { configureStore } from '@reduxjs/toolkit';
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Banda } from '../../src/Components/Banda';
import { useUploadsStore } from '../../src/hooks';
import { authSlice } from '../../src/store/auth/authSlice';
import { authenticatedState2 } from '../fixtures/authFixtures';



const storeAutenticado = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: authenticatedState2
    }
});
jest.mock('../../src/hooks/useUploadsStore');

describe('Pruebas en el  <Banda />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('Debe mostrar el componente correctamente', async() => {
        useUploadsStore.mockReturnValue({
            getFotoPerfilBanda: jest.fn().mockReturnValue(''),
        });
        
        act(() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Banda nombre={"Prueba"}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        const texto = screen.getByText('Prueba');
        expect( texto ).not.toBe( undefined);
        
    });
});