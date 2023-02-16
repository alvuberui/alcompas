import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Musico, NavBar } from '../../src/Components';
import { useUploadsStore, useAuthStore } from '../../src/hooks';
import { authSlice } from '../../src/store/auth/authSlice';
import { authenticatedState2 } from '../fixtures/authFixtures';
import { banda1 } from '../fixtures/bandaFixtures';
import { testUserCredentials2, testUserCredentials } from '../fixtures/testUser';
import { Buscador } from '../../src/Components/Buscador';


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

describe('Pruebas en el  <NavBar />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('Debe mostrar el componente correctamente', async() => {
        useAuthStore.mockReturnValue({
            user: testUserCredentials2,
            getUserByiD: jest.fn().mockReturnValue(testUserCredentials2),
            startLogout: jest.fn(),
        });

        useUploadsStore.mockReturnValue({
            getFotoPerfilUsuario: jest.fn().mockReturnValue(""),
        });

        
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <NavBar />
                    </MemoryRouter>
                </Provider>
            );
        });
        
        const boton = screen.getByLabelText("buscador");
        expect(boton).not.toBe(undefined);
    });

    test('Debe mostrar el componente correctamente click en logout', async() => {
        useAuthStore.mockReturnValue({
            user: testUserCredentials,
            getUserByiD: jest.fn().mockReturnValue(testUserCredentials),
            startLogout: jest.fn(),
        });

        useUploadsStore.mockReturnValue({
            getFotoPerfilUsuario: jest.fn().mockReturnValue(""),
        });

        
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <NavBar />
                    </MemoryRouter>
                </Provider>
            );
        });
        
        const boton = screen.getByLabelText("logout");
        expect(boton).not.toBe(undefined);
        fireEvent.click(boton);
    });

    test('Debe mostrar el componente correctamente con clik en perfil', async() => {
        useAuthStore.mockReturnValue({
            user: testUserCredentials,
            getUserByiD: jest.fn().mockReturnValue(testUserCredentials),
            startLogout: jest.fn(),
        });

        useUploadsStore.mockReturnValue({
            getFotoPerfilUsuario: jest.fn().mockReturnValue(""),
        });

        
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <NavBar />
                    </MemoryRouter>
                </Provider>
            );
        });
        
        const boton = screen.getByLabelText("perfil");
        expect(boton).not.toBe(undefined);
        fireEvent.click(boton);
    });

    

    
});