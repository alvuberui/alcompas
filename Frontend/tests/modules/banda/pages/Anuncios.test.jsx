import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { MisBandas } from '../../../../src/modules/banda/pages/MisBandas';
import { useAuthStore, useDirectivosStore, useAnunciosStore  } from '../../../../src/hooks';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState, authenticatedState2 } from '../../../fixtures/authFixtures';
import { banda1, banda2 } from '../../../fixtures/bandaFixtures';
import { directivo1 } from '../../../fixtures/directivoFixtures';
import { noticia1 } from '../../../fixtures/anuncioFixtures';
import { Anuncios } from '../../../../src/modules/banda/pages/Anuncios';
import { NuevoAnuncio } from '../../../../src/modules/banda/modals/NuevoAnuncio';

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

jest.mock('../../../../src/modules/banda/modals/NuevoAnuncio');
jest.mock('../../../../src/hooks/useAuthStore');
jest.mock('../../../../src/hooks/useDirectivosStore');
jest.mock('../../../../src/hooks/useAnunciosStore');

describe('Pruebas en <Anuncios />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user
        });

        useDirectivosStore.mockReturnValue({
            getDirectivoByUserId: jest.fn().mockReturnValue( [directivo1] ),
        });

        useAnunciosStore.mockReturnValue({
            getNoticiasByBanda: jest.fn().mockReturnValue( [noticia1] )
        });
        
        act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <Anuncios  />
                    </MemoryRouter>
                </Provider>
            );
        });
         waitFor(() => {
            expect( screen.getByText('Administración de noticias')).not.toBe( undefined);
            const boton = screen.getByLabelText('añadir');
            fireEvent.click(boton);
        });
        
    });

    test('debe de mostrar el componente correctamente sin anuncios', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user
        });

        useDirectivosStore.mockReturnValue({
            getDirectivoByUserId: jest.fn().mockReturnValue( [directivo1] ),
        });

        useAnunciosStore.mockReturnValue({
            getNoticiasByBanda: jest.fn().mockReturnValue( [] )
        });
        
        act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <Anuncios  />
                    </MemoryRouter>
                </Provider>
            );
        });
         waitFor(() => {
            expect( screen.getByText('Administración de noticias')).not.toBe( undefined);
            const boton = screen.getByLabelText('añadir');
            fireEvent.click(boton);
        });
        
    });


});