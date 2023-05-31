import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Comentario } from '../../src/Components/Comentario';
import { useAuthStore, useUploadsStore } from '../../src/hooks';
import { authSlice } from '../../src/store/auth/authSlice';
import { authenticatedState2 } from '../fixtures/authFixtures';
import { testUserCredentials2 } from '../fixtures/testUser';
import { comentario1 } from '../fixtures/comentarioFixtures';
import { Estadistica } from '../../src/Components/Estadistica';
import { banda1 } from '../fixtures/bandaFixtures';


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

describe('Pruebas en el  <Estadistica />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('Debe mostrar el componente correctamente popular', async() => {
        useAuthStore.mockReturnValue({
            getUserByiD: jest.fn().mockReturnValue(testUserCredentials2),
            user: testUserCredentials2,
        });

        useUploadsStore.mockReturnValue({
            getFotoPerfilBanda: jest.fn(),
        });

        
        await act(async() => {
            banda1.numero = 10;
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Estadistica banda={banda1} tipo={"popular"}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        const boton = screen.getByText('10 me gusta');
        expect( boton ).not.toBe( undefined);

        
    });

    test('Debe mostrar el componente correctamente semana santa', async() => {
        useAuthStore.mockReturnValue({
            getUserByiD: jest.fn().mockReturnValue(testUserCredentials2),
            user: testUserCredentials2,
        });

        useUploadsStore.mockReturnValue({
            getFotoPerfilBanda: jest.fn(),
        });

        
        await act(async() => {
            banda1.numero = 10;
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Estadistica banda={banda1} tipo={"semana santa"}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        const boton = screen.getByText('10 procesiones de semana santa');
        expect( boton ).not.toBe( undefined);

        
    });

    test('Debe mostrar el componente correctamente eventos', async() => {
        useAuthStore.mockReturnValue({
            getUserByiD: jest.fn().mockReturnValue(testUserCredentials2),
            user: testUserCredentials2,
        });

        useUploadsStore.mockReturnValue({
            getFotoPerfilBanda: jest.fn(),
        });

        
        await act(async() => {
            banda1.numero = 10;
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Estadistica banda={banda1} tipo={"eventos"}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        const boton = screen.getByText('10 eventos');
        expect( boton ).not.toBe( undefined);

        
    });
});