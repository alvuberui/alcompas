import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { useArchiverosStore, useAuthStore, useDirectivosStore, useEstudiosStore, useInstrumentosStore, useMusicosStore, useUploadsStore } from '../../../../src/hooks';
import { Perfil } from '../../../../src/modules/user';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { estudio1 } from '../../../fixtures/estudioFixture';
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
jest.mock('../../../../src/hooks/useInstrumentosStore');
jest.mock('../../../../src/hooks/useEstudiosStore');
jest.mock('../../../../src/hooks/useUploadsStore');
jest.mock('../../../../src/hooks/useArchiverosStore');
jest.mock('../../../../src/hooks/useDirectivosStore');
jest.mock('../../../../src/hooks/useMusicosStore');
jest.mock('../../../../src/modules/user/modals/AñadirInstrumentoModal');
jest.mock('../../../../src/modules/user/modals/AñadirEstudioModal');
jest.mock('../../../../src/modules/user/modals/EditarFoto');

describe('Pruebas en <Perfil />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            startUpdatePassword: jest.fn(),
            startDelete: jest.fn(),
            user: authenticatedState2,
            getUserByiD: jest.fn().mockReturnValue( authenticatedState2 ),
        });

        useInstrumentosStore.mockReturnValue({
            getInstrumentosByUserId: jest.fn().mockReturnValue( [] ),
        });

        useEstudiosStore.mockReturnValue({
            getEstudiosByUserId: jest.fn().mockReturnValue( [ estudio1 ] ),
        });

        useUploadsStore.mockReturnValue({
            getFotoPerfilUsuario: jest.fn().mockReturnValue( '' ),
        });

        useArchiverosStore.mockReturnValue({
            getArchiverosByUserId: jest.fn().mockReturnValue( [] ),
        });

        useDirectivosStore.mockReturnValue({
            getDirectivoByUserId: jest.fn().mockReturnValue( [directivo1] ),
        });

        useMusicosStore.mockReturnValue({
            getMusicosByUserId: jest.fn().mockReturnValue( [] ),
        });

        
        await act( async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <Perfil />
                    </MemoryRouter>
                </Provider>
            );
        });
        
        const texto = screen.getByLabelText('desc');
        expect(texto).not.toBeNull();

        await act( async() => {
            const click1 = screen.getByLabelText('click1');
            fireEvent.click(click1);

            const click2 = screen.getByLabelText('click2');
            fireEvent.click(click2);
        });


        
        
    });
});

