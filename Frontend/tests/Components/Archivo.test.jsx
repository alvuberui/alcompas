import { configureStore } from '@reduxjs/toolkit';
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Banda } from '../../src/Components/Banda';
import { useUploadsStore } from '../../src/hooks';
import { authSlice } from '../../src/store/auth/authSlice';
import { authenticatedState2 } from '../fixtures/authFixtures';
import { Archivo } from '../../src/Components/Archivo';
import { partitura } from '../fixtures/partituraFixtures';


const storeAutenticado = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: authenticatedState2
    }
});

describe('Pruebas en el  <Archivo />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('Debe mostrar el componente correctamente', async() => {
        act(() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Archivo partitura={partitura}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        const texto = screen.getByLabelText('archivo');
        expect( texto ).not.toBe( undefined);
        
    });
});