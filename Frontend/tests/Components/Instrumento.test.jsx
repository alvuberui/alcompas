import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Instrumento } from '../../src/Components';
import { useAuthStore, useInstrumentosStore } from '../../src/hooks';
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
jest.mock('../../src/hooks/useAuthStore');
jest.mock('../../src/hooks/useInstrumentosStore');
jest.mock('../../src/modules/user/modals/AñadirInstrumentoModal');

describe('Pruebas en el  <Estudio />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('Debe mostrar el componente correctamente', async() => {
        useInstrumentosStore.mockReturnValue({
            eliminarInstrumento: jest,
        });

        useAuthStore.mockReturnValue({
            getUserByiD: jest.fn().mockReturnValue( testUserCredentials2),
        });

        
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Instrumento  iguales={true}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        await act(async() => {
            const boton = screen.getByText("Editar");
            expect(boton).not.toBe(undefined);
            fireEvent.click(boton);
        });
    });

    test('Debe mostrar el componente correctamente eliminando', async() => {
        useInstrumentosStore.mockReturnValue({
            eliminarInstrumento: jest,
        });

        useAuthStore.mockReturnValue({
            getUserByiD: jest.fn().mockReturnValue( testUserCredentials2),
        });

        
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Instrumento  iguales={true}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        await act(async() => {
            const boton = screen.getByText("Eliminar");
            expect(boton).not.toBe(undefined);
            fireEvent.click(boton);
        });
    });

    
});