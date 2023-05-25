import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Comentario } from '../../src/Components/Comentario';
import { useAuthStore, useEventosStore, useBandasStore, useDirectivosStore, useLikesStore, useUploadsStore } from '../../src/hooks';
import { authSlice } from '../../src/store/auth/authSlice';
import { authenticatedState2 } from '../fixtures/authFixtures';
import { testUserCredentials2 } from '../fixtures/testUser';
import { procesionFixture, actuacionFixture, ensayoFixture } from '../fixtures/eventoFixture';
import { banda1 } from '../fixtures/bandaFixtures';
import { directivo1 } from '../fixtures/directivoFixtures';
import { noticia1 } from '../fixtures/anuncioFixtures';
import { Noticia } from '../../src/Components/Noticia';


const storeAutenticado = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: authenticatedState2
    }
});
jest.mock('../../src/hooks/useEventosStore');
jest.mock('../../src/hooks/useBandasStore');
jest.mock('../../src/hooks/useUploadsStore');
jest.mock('../../src/hooks/useDirectivosStore');
jest.mock('../../src/hooks/useLikesStore');
jest.mock('../../src/hooks/useAuthStore');

describe('Pruebas en el  <Evento />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('Debe mostrar el componente cargando', async() => {
        useAuthStore.mockReturnValue({
            user: testUserCredentials2,
        });

        useEventosStore.mockReturnValue({
            deleteByTipoId: jest.fn(),
        });

        useBandasStore.mockReturnValue({
            getBandaById: jest.fn().mockReturnValue(banda1),
            perteneceUsuarioBanda: jest.fn().mockReturnValue(true),
        });

        useUploadsStore.mockReturnValue({
            getFotoPerfilBanda: jest.fn(),
        });

        useDirectivosStore.mockReturnValue({
            getDirectivoByUserId: jest.fn().mockReturnValue([directivo1]),
        });

        useLikesStore.mockReturnValue({
            publicarLike: jest.fn(),
            publicarDislike: jest.fn(),
            getLikeByTipoAndReferencia: jest.fn(),
            errores: [],
            getNumeroLikes: jest.fn(),
        });

        
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Noticia noticia={noticia1} setNoticias={jest.fn()} />
                    </MemoryRouter>
                </Provider>
            );
        });
        const boton = screen.getByLabelText("add to favorites");
        fireEvent.click(boton);
        fireEvent.click(boton);
        const botonDelete = screen.getByLabelText("delete");
        fireEvent.click(botonDelete);

       
    });
});