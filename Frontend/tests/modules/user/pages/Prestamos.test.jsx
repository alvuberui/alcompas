import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, useParams } from 'react-router-dom';
import { MisBandas } from '../../../../src/modules/banda/pages/MisBandas';
import { useAuthStore, useDirectivosStore, usePrestamosStore  } from '../../../../src/hooks';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState } from '../../../fixtures/authFixtures';
import { banda1, banda2 } from '../../../fixtures/bandaFixtures';
import { directivo1 } from '../../../fixtures/directivoFixtures';
import { noticia1 } from '../../../fixtures/anuncioFixtures';
import { instrumento1 } from '../../../fixtures/instrumentoFixtures';
import { Instrumentos } from '../../../../src/modules/banda/pages/Instrumentos';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { prestamo2 } from '../../../fixtures/prestamoFixtures';
import { PrestamosBanda } from '../../../../src/modules/banda/pages/PrestamosBanda';
import { Prestamos } from '../../../../src/modules/user';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => (fn) => fn(),
}));

const store = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: authenticatedState
    }
})


jest.mock('../../../../src/hooks/useAuthStore');
jest.mock('../../../../src/hooks/usePrestamosStore');

describe('Pruebas en <Instrumentos />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user
        });

        usePrestamosStore.mockReturnValue({
            obtenerPrestamosUsuario: jest.fn().mockReturnValue( [prestamo2,prestamo2,prestamo2,prestamo2,prestamo2,prestamo2,prestamo2] ),
        });
        
        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                            <Prestamos    />
                    </MemoryRouter>
                </Provider>
            );
        });
          waitFor(() => {
            expect( screen.getByText('Mis Préstamos')).not.toBe( undefined);
            expect( screen.getByText('Vestimenta')).toBe( undefined);
        
        });
        
    
    });

    test('debe de mostrar el componente correctamente sin prestamos', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user
        });

        usePrestamosStore.mockReturnValue({
            obtenerPrestamosUsuario: jest.fn().mockReturnValue( [] ),
        });
        
        act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                            <Prestamos    />
                    </MemoryRouter>
                </Provider>
            );
        });
        await  waitFor(() => {
            expect( screen.getByText('No hay préstamos...')).not.toBe( undefined);
        
        });
        
    
    });
});