import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Estudio } from '../../src/Components';
import { useAuthStore, useEstudiosStore } from '../../src/hooks';
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
jest.mock('../../src/hooks/useEstudiosStore');
jest.mock('../../src/hooks/useAuthStore');
jest.mock('../../src/modules/user');


describe('Pruebas en el  <Estudio />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('Debe mostrar el componente correctamente', async() => {
        useAuthStore.mockReturnValue({
            getUserByiD: jest.fn().mockReturnValue(testUserCredentials2),
        });

        useEstudiosStore.mockReturnValue({
            eliminarEstudio: jest.fn(),
        });

        
        act(() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Estudio  usuario={"63c58bbdaf3c802189102e0e"} iguales={true}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        await act(async() => {
            const boton = screen.getByLabelText("eliminar");
            fireEvent.click(boton);
        });
    });

    test('Debe mostrar el componente correctamente con editar', async() => {
        useAuthStore.mockReturnValue({
            getUserByiD: jest.fn().mockReturnValue(testUserCredentials2),
        });

        useEstudiosStore.mockReturnValue({
            eliminarEstudio: jest.fn(),
        });

        
        act(() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Estudio  usuario={"63c58bbdaf3c802189102e0e"} iguales={true}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        await act(async() => {
            const boton = screen.getByLabelText("editar");
            fireEvent.click(boton);
            const boton2 = screen.getByLabelText("eliminar");
            fireEvent.click(boton2);
        });
    });
});