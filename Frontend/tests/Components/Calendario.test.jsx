import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Comentario } from '../../src/Components/Comentario';
import { useAuthStore, useBandasStore, useComentariosStore, useDirectivosStore, useEventosStore, useLikesStore, useUploadsStore } from '../../src/hooks';
import { authSlice } from '../../src/store/auth/authSlice';
import { authenticatedState2 } from '../fixtures/authFixtures';
import { testUserCredentials2 } from '../fixtures/testUser';
import { comentario1 } from '../fixtures/comentarioFixtures';
import { procesionFixture, actuacionFixture, ensayoFixture } from '../fixtures/eventoFixture';
import { Calendario } from '../../src/Components/Calendario';


const storeAutenticado = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: authenticatedState2
    }
});
jest.mock('../../src/hooks/useEventosStore');
jest.mock('../../src/hooks/useAuthStore');
jest.mock('../../src/hooks/useBandasStore');
jest.mock('../../src/hooks/useUploadsStore');
jest.mock('../../src/hooks/useDirectivosStore');
jest.mock('../../src/hooks/useLikesStore');

describe('Pruebas en el  <Calendario />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('Debe mostrar el componente correctamente', async() => {
        useAuthStore.mockReturnValue({
            getUserByiD: jest.fn().mockReturnValue(testUserCredentials2),
            user: testUserCredentials2,
        });

        useEventosStore.mockReturnValue({
            getDestacados: jest.fn().mockReturnValue([procesionFixture, actuacionFixture]),
            getEventosByDateAndBanda: jest.fn().mockReturnValue([procesionFixture, actuacionFixture, ensayoFixture]),
            deleteByTipoId: jest.fn(),
        });

        useBandasStore.mockReturnValue({
            getBandaById: jest.fn().mockReturnValue({}),
            perteneceUsuarioBanda: jest.fn().mockReturnValue(true),
        });

        useUploadsStore.mockReturnValue({
            getFotoPerfilBanda: jest.fn().mockReturnValue({}),
        });

        useDirectivosStore.mockReturnValue({
            getDirectivoByUserId: jest.fn().mockReturnValue({}),
        });

        useLikesStore.mockReturnValue({
            publicarLike: jest.fn(),
            publicarDislike: jest.fn(),
            getLikeByTipoAndReferencia: jest.fn().mockReturnValue([]),
            errores: jest.fn(),
            getNumeroLikes: jest.fn().mockReturnValue(0),
        });



        
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Calendario tipo={"dashboard"}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        const boton = screen.getByLabelText("lista");
        expect(boton).not.toBeNull();

        
    });

    test('Debe mostrar el componente correctamente banda', async() => {
        useAuthStore.mockReturnValue({
            getUserByiD: jest.fn().mockReturnValue(testUserCredentials2),
            user: testUserCredentials2,
        });

        useEventosStore.mockReturnValue({
            getDestacados: jest.fn().mockReturnValue([procesionFixture, actuacionFixture]),
            getEventosByDateAndBanda: jest.fn().mockReturnValue([procesionFixture, actuacionFixture, ensayoFixture]),
            deleteByTipoId: jest.fn(),
        });

        useBandasStore.mockReturnValue({
            getBandaById: jest.fn().mockReturnValue({}),
            perteneceUsuarioBanda: jest.fn().mockReturnValue(true),
        });

        useUploadsStore.mockReturnValue({
            getFotoPerfilBanda: jest.fn().mockReturnValue({}),
        });

        useDirectivosStore.mockReturnValue({
            getDirectivoByUserId: jest.fn().mockReturnValue({}),
        });

        useLikesStore.mockReturnValue({
            publicarLike: jest.fn(),
            publicarDislike: jest.fn(),
            getLikeByTipoAndReferencia: jest.fn().mockReturnValue([]),
            errores: jest.fn(),
            getNumeroLikes: jest.fn().mockReturnValue(0),
        });



        
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Calendario tipo={"perfil"}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        const boton = screen.getByLabelText("lista");
        expect(boton).not.toBeNull();

        
    });
});