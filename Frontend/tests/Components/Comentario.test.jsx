import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Comentario } from '../../src/Components/Comentario';
import { useAuthStore, useComentariosStore, useLikesStore, useUploadsStore } from '../../src/hooks';
import { authSlice } from '../../src/store/auth/authSlice';
import { authenticatedState2 } from '../fixtures/authFixtures';
import { testUserCredentials2 } from '../fixtures/testUser';
import { comentario1 } from '../fixtures/comentarioFixtures';
import { likeFixtures } from '../fixtures/likeFixtures';


const storeAutenticado = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: authenticatedState2
    }
});
jest.mock('../../src/hooks/useComentariosStore');
jest.mock('../../src/hooks/useAuthStore');
jest.mock('../../src/hooks/useUploadsStore');
jest.mock('../../src/hooks/useLikesStore');

describe('Pruebas en el  <Buscador />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('Debe mostrar el componente correctamente', async() => {
        useAuthStore.mockReturnValue({
            getUserByiD: jest.fn().mockReturnValue(testUserCredentials2),
            user: testUserCredentials2,
        });

        useComentariosStore.mockReturnValue({
            eliminarComentario: jest.fn(),
        });

        useUploadsStore.mockReturnValue({
            getFotoPerfilUsuario: jest.fn(),
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
                        <Comentario comentario={comentario1} eliminar={jest.fn()}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        const boton = screen.getByLabelText("settings");
        fireEvent.click(boton);
        const meGusta = screen.getByLabelText("add to favorites");
        fireEvent.click(meGusta);
        fireEvent.click(meGusta);

        
    });
});