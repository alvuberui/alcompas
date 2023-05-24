import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { RedesSociales } from '../../../../src/modules/banda/pages/RedesSociales';
import { useAuthStore, useRedesSocialesStore, useDirectivosStore } from '../../../../src/hooks';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { banda1, banda2 } from '../../../fixtures/bandaFixtures';
import { redSocial1 } from '../../../fixtures/redSocialFixtures';
import { testUserCredentials2, testUserCredentials } from '../../../fixtures/testUser';
import { directivo1 } from '../../../fixtures/directivoFixtures';

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
jest.mock('../../../../src/hooks/useRedesSocialesStore');
jest.mock('../../../../src/hooks/useDirectivosStore');

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn().mockReturnValue({ bandaId: "63c850f1f4f9246bd4ecb661" }),
}));

describe('Pruebas en <RedesSociales />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: testUserCredentials2,
        });

        useRedesSocialesStore.mockReturnValue({
            getAllByBandaId: jest.fn().mockReturnValue( [redSocial1] ),
            eliminarRedSocial: jest.fn(),
        });

        useDirectivosStore.mockReturnValue({
            getDirectivoByUserId: jest.fn().mockReturnValue( [directivo1] ),
        });
        

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <RedesSociales />
                    </MemoryRouter>
                </Provider>
            );
        });

            const texto = screen.getByLabelText('añadir');
            expect( texto ).not.toBe( undefined);   

    });

    

});