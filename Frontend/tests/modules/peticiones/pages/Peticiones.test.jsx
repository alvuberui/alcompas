import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Peticiones } from '../../../../src/modules/peticiones/pages/Peticiones';
import { Peticion } from '../../../../src/Components';
import { useAuthStore, usePeticionesStore } from '../../../../src/hooks';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { peticion1, peticion2 } from '../../../fixtures/peticionFixtures';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => (fn) => fn(),
}));

const store = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: authenticatedState2
    }
})



jest.mock('../../../../src/hooks/useAuthStore');
jest.mock('../../../../src/hooks/usePeticionesStore');
jest.mock('../../../../src/Components/Peticion');

describe('Pruebas en <Peticiones />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2
        });

        usePeticionesStore.mockReturnValue({
            getPeticionesByUserId: jest.fn().mockReturnValue( [peticion1] ),
        });
        
        await act(async () => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <Peticiones />
                    </MemoryRouter>
                </Provider>
            );
        });
        
        const texto = screen.getByText('MIS PETICIONES');
        expect(texto).not.toBeNull();
        
    });
});