import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Comentario } from '../../src/Components/Comentario';
import { useAuthStore, useComentariosStore } from '../../src/hooks';
import { authSlice } from '../../src/store/auth/authSlice';
import { authenticatedState2 } from '../fixtures/authFixtures';
import { testUserCredentials2 } from '../fixtures/testUser';



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

        
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Comentario titulo={"PRUEBA"} usuario={"63c58bbdaf3c802189102e0e"}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        const texto = screen.getByText("PRUEBA");
        expect( texto ).not.toBe( undefined);
        const boton = screen.getByLabelText("eliminar");
        fireEvent.click(boton);

        
    });
});