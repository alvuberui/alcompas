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
import { Documento } from '../../src/Components/Documento';
import { transaccion } from '../fixtures/transaccionFixtures';


const storeAutenticado = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: authenticatedState2
    }
});

describe('Pruebas en el  <Documento />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('Debe mostrar el componente correctamente', async() => {
        act(() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Documento transacciones={ [transaccion] }/>
                    </MemoryRouter>
                </Provider>
            );
        });
        const texto = screen.getByText('Cantidad');
        expect( texto ).not.toBe( undefined);
        const texto2 = screen.getByText('Gasto de prueba');
        expect( texto2 ).not.toBe( undefined);
        
    });
});