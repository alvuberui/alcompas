import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { PanelDirectivo } from '../../../../src/modules/banda/pages/PanelDirectivo';
import { useAuthStore, useBandasStore, useDirectivosStore } from '../../../../src/hooks';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { banda1, banda2 } from '../../../fixtures/bandaFixtures';
import { directivo1 } from '../../../fixtures/directivoFixtures';
import { testUserCredentials2 } from '../../../fixtures/testUser';


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

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn().mockReturnValue({ bandaId: "63c850f1f4f9246bd4ecb661" }),
}));

jest.mock('../../../../src/hooks/useAuthStore');
jest.mock('../../../../src/hooks/useBandasStore');
jest.mock('../../../../src/hooks/useDirectivosStore');

describe('Pruebas en <PanelDirectivo />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: testUserCredentials2
        });

        useDirectivosStore.mockReturnValue({
            getDirectivoByUserId: jest.fn().mockReturnValue( [directivo1] ),
            abandonarBandaDirectivo: jest.fn(),
        });

        useBandasStore.mockReturnValue({
            eliminarBanda: jest.fn(),
        });

        
        
        act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <PanelDirectivo />
                    </MemoryRouter>
                </Provider>
            );
        });
        await waitFor(() => {
            
            const abandonar = screen.getByLabelText('abandonar');
            fireEvent.click( abandonar );
            const eliminar = screen.getByLabelText('eliminar');
            fireEvent.click( eliminar );  
        });
        
        
    });

    


});