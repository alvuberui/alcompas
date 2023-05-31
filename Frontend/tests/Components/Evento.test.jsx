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
import { Evento } from '../../src/Components/Evento';
import { likeFixtures } from '../fixtures/likeFixtures';


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
            getDirectivoByUserId: jest.fn().mockReturnValue(directivo1),
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
                        <Evento evento={procesionFixture} setEventos={jest.fn()} />
                    </MemoryRouter>
                </Provider>
            );
        });
        const boton = screen.getByLabelText("loading");
        expect(boton).not.toBeNull();
    });

    test('Debe mostrar el componente de procesion correctamente', async() => {
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
            getFotoPerfilBanda: jest.fn().mockReturnValue("fwefwe"),
        });

        useDirectivosStore.mockReturnValue({
            getDirectivoByUserId: jest.fn().mockReturnValue(directivo1),
        });

        useLikesStore.mockReturnValue({
            publicarLike: jest.fn(),
            publicarDislike: jest.fn(),
            getLikeByTipoAndReferencia: jest.fn().mockReturnValue(likeFixtures),
            errores: [],
            getNumeroLikes: jest.fn().mockReturnValue(1),
        });

        
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Evento evento={procesionFixture} setEventos={jest.fn()} />
                    </MemoryRouter>
                </Provider>
            );
        });
        const boton = screen.getByText("Agrupación Musical EJEMPLO");
        expect(boton).not.toBeNull();
    });

    test('Debe mostrar el componente de actuacion correctamente', async() => {
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
            getFotoPerfilBanda: jest.fn().mockReturnValue("fwefwe"),
        });

        useDirectivosStore.mockReturnValue({
            getDirectivoByUserId: jest.fn().mockReturnValue(directivo1),
        });

        useLikesStore.mockReturnValue({
            publicarLike: jest.fn(),
            publicarDislike: jest.fn(),
            getLikeByTipoAndReferencia: jest.fn().mockReturnValue(likeFixtures),
            errores: [],
            getNumeroLikes: jest.fn().mockReturnValue(1),
        });

        
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Evento evento={actuacionFixture} setEventos={jest.fn()} />
                    </MemoryRouter>
                </Provider>
            );
        });
        const boton = screen.getByText("Agrupación Musical EJEMPLO");
        expect(boton).not.toBeNull();
    });

    test('Debe mostrar el componente de ensayo correctamente', async() => {
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
            getFotoPerfilBanda: jest.fn().mockReturnValue("fwefwe"),
        });

        useDirectivosStore.mockReturnValue({
            getDirectivoByUserId: jest.fn().mockReturnValue([directivo1]),
        });

        useLikesStore.mockReturnValue({
            publicarLike: jest.fn(),
            publicarDislike: jest.fn(),
            getLikeByTipoAndReferencia: jest.fn().mockReturnValue(likeFixtures),
            errores: [],
            getNumeroLikes: jest.fn().mockReturnValue(1),
        });

        
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Evento evento={ensayoFixture} setEventos={jest.fn()} />
                    </MemoryRouter>
                </Provider>
            );
        });
        const boton = screen.getByText("Agrupación Musical EJEMPLO");
        expect(boton).not.toBeNull();

        const megusta = screen.getByLabelText("add to favorites");
        fireEvent.click(megusta);
        fireEvent.click(megusta);

        const  botonDelete = screen.getByLabelText("delete");
        fireEvent.click(botonDelete );
    });


});