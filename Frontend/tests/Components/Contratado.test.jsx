import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Comentario } from '../../src/Components/Comentario';
import { useAuthStore, useUploadsStore, useContratadosStore } from '../../src/hooks';
import { authSlice } from '../../src/store/auth/authSlice';
import { authenticatedState2 } from '../fixtures/authFixtures';
import { testUserCredentials2 } from '../fixtures/testUser';
import { comentario1 } from '../fixtures/comentarioFixtures';
import { Contratado } from '../../src/Components/Contratado';
import { musico1 } from '../fixtures/musicoFixtures';


const storeAutenticado = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: authenticatedState2
    }
});
jest.mock('../../src/hooks/useUploadsStore');
jest.mock('../../src/hooks/useAuthStore');
jest.mock('../../src/hooks/useContratadosStore');

describe('Pruebas en el  <Contratado />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('Debe mostrar el componente correctamente', async() => {
        useAuthStore.mockReturnValue({
            getUserByiD: jest.fn().mockReturnValue(testUserCredentials2)
        });

        useUploadsStore.mockReturnValue({
            getFotoPerfilUsuario: jest.fn(),
        });

        useContratadosStore.mockReturnValue({
            crearContratados: jest.fn()
        });

        
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Contratado musico={musico1}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        const boton = screen.getByLabelText("boton");
        fireEvent.click(boton);

        const nombre = screen.getByText("Álvaro Úbeda Ruiz: Corneta");
        expect(nombre).not.toBeNull();

        
    });
});