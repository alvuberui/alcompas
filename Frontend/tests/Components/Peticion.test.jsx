import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Musico, Peticion } from '../../src/Components';
import { useDirectivosStore, useBandasStore, useAuthStore, usePeticionesStore } from '../../src/hooks';
import { authSlice } from '../../src/store/auth/authSlice';
import { authenticatedState2 } from '../fixtures/authFixtures';
import { banda1 } from '../fixtures/bandaFixtures';
import { testUserCredentials2 } from '../fixtures/testUser';
import { directivo1 } from '../fixtures/directivoFixtures';


const storeAutenticado = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: authenticatedState2
    }
});

jest.mock('../../src/hooks/useBandasStore');
jest.mock('../../src/hooks/useDirectivosStore');
jest.mock('../../src/hooks/useAuthStore');
jest.mock('../../src/hooks/usePeticionesStore');

describe('Pruebas en el  <Estudio />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('Debe mostrar el componente correctamente', async() => {
        useBandasStore.mockReturnValue({
            getBandaById: jest.fn().mockReturnValue(banda1),
        });

        useDirectivosStore.mockReturnValue({
            getDirectivoById: jest.fn().mockReturnValue(directivo1),
        });

        usePeticionesStore.mockReturnValue({
            aceptarPeticion: jest.fn(),
            rechazarPeticion: jest.fn(),
        });

        useAuthStore.mockReturnValue({
            getUserByiD: jest.fn().mockReturnValue(testUserCredentials2),
            user: testUserCredentials2,
        });

        
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Peticion estado={"Pendiente"} usuario={"63c58bbdaf3c802189102e0e"} />
                    </MemoryRouter>
                </Provider>
            );
        });
        
        const boton = screen.getByLabelText("aceptar");
        expect(boton).not.toBe(undefined);
        fireEvent.click(boton);
    });

    test('Debe mostrar el componente correctamente denegando', async() => {
        useBandasStore.mockReturnValue({
            getBandaById: jest.fn().mockReturnValue(banda1),
        });

        useDirectivosStore.mockReturnValue({
            getDirectivoById: jest.fn().mockReturnValue(directivo1),
        });

        usePeticionesStore.mockReturnValue({
            aceptarPeticion: jest.fn(),
            rechazarPeticion: jest.fn(),
        });

        useAuthStore.mockReturnValue({
            getUserByiD: jest.fn().mockReturnValue(testUserCredentials2),
            user: testUserCredentials2,
        });

        
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Peticion estado={"Pendiente"} usuario={"63c58bbdaf3c802189102e0e"} />
                    </MemoryRouter>
                </Provider>
            );
        });
        
        const boton = screen.getByLabelText("denegar");
        expect(boton).not.toBe(undefined);
        fireEvent.click(boton);
    });

    

    
});