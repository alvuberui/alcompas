import { configureStore } from '@reduxjs/toolkit';
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Buscador } from '../../src/Components/Buscador';
import { useBandasStore } from '../../src/hooks';
import { authSlice } from '../../src/store/auth/authSlice';
import { authenticatedState2 } from '../fixtures/authFixtures';
import { banda1 } from '../fixtures/bandaFixtures';



const storeAutenticado = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: authenticatedState2
    }
});
jest.mock('../../src/hooks/useBandasStore');

describe('Pruebas en el  <Buscador />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('Debe mostrar el componente correctamente', async() => {
        useBandasStore.mockReturnValue({
            getBandas: jest.fn().mockReturnValue([ banda1 ]),
        });
        
        act(() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Buscador />
                    </MemoryRouter>
                </Provider>
            );
        });
        const texto = screen.getByLabelText('buscador');
        expect( texto ).not.toBe( undefined);
        
    });
});