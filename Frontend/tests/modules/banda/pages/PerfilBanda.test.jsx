import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { PerfilBanda } from '../../../../src/modules/banda/pages/PerfilBanda';
import { useAuthStore, useBandasStore, useDirectivosStore, useComentariosStore, useMusicosStore, useUploadsStore, useRedesSocialesStore } from '../../../../src/hooks';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { banda1, banda2 } from '../../../fixtures/bandaFixtures';
import { directivo1 } from '../../../fixtures/directivoFixtures';
import { comentario1 } from '../../../fixtures/comentarioFixtures';
import { testUserCredentials2 } from '../../../fixtures/testUser';
import { musico1 } from '../../../fixtures/musicoFixtures';
import { redSocial1 } from '../../../fixtures/redSocialFixtures';
import { EditarFoto } from '../../../../src/modules/user';

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
jest.mock('../../../../src/hooks/useBandasStore');
jest.mock('../../../../src/hooks/useDirectivosStore');
jest.mock('../../../../src/hooks/useComentariosStore');
jest.mock('../../../../src/hooks/useMusicosStore');
jest.mock('../../../../src/hooks/useUploadsStore');
jest.mock('../../../../src/hooks/useRedesSocialesStore');
jest.mock('../../../../src/modules/user');


describe('Pruebas en <PerfilBanda />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: testUserCredentials2,
            getUserByiD: jest.fn().mockReturnValue(testUserCredentials2),
        });

        useBandasStore.mockReturnValue({
            getBandaById: jest.fn().mockReturnValue(banda1),
        });

        useComentariosStore.mockReturnValue({
            getComentariosByBandaId: jest.fn().mockReturnValue([comentario1]),
        });

        useMusicosStore.mockReturnValue({
            getMusicosBanda: jest.fn().mockReturnValue({ 'Trompeta': [musico1]}),
            abandonarBandaMusico: jest.fn(),
            esMusicoByBandaId: jest.fn().mockReturnValue(true),
        });

        useUploadsStore.mockReturnValue({
            getFotoPerfilBanda: jest.fn(),
        });

        useDirectivosStore.mockReturnValue({
            getDirectivosByBandaId: jest.fn().mockReturnValue({'Presidente:': [directivo1]}),
        });

        useRedesSocialesStore.mockReturnValue({
            getAllByBandaId: jest.fn().mockReturnValue([redSocial1]),
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <PerfilBanda />
                    </MemoryRouter>
                </Provider>
            );
        });
        const boton =  screen.getByLabelText('contacto');
        expect( boton ).not.toBe( undefined);
    });
});