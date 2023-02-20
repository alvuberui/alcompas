import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { MisBandas } from '../../../../src/modules/banda/pages/MisBandas';
import { useAuthStore, useBandasStore } from '../../../../src/hooks';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState } from '../../../fixtures/authFixtures';
import { banda1, banda2 } from '../../../fixtures/bandaFixtures';

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
jest.mock('../../../../src/hooks/useBandasStore');

describe('Pruebas en <MisBandas />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState
        });

        useBandasStore.mockReturnValue({
            getBandasByNombre: jest.fn().mockReturnValue( [banda1] ),
            getBandasByUserId: jest.fn().mockReturnValue( [banda1] ),
        });
        
        act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <MisBandas />
                    </MemoryRouter>
                </Provider>
            );
        });
        waitFor(() => {
            expect( screen.getByText('Buscar')).not.toBe( undefined);
            expect( screen.getByText('Agrupación Musical EJEMPLO')).not.toBe( undefined);
        });
        
    });
});