import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Musico, Peticion, Plantilla } from '../../src/Components';
import { useDirectivosStore, useBandasStore, useAuthStore, usePeticionesStore } from '../../src/hooks';
import { authSlice } from '../../src/store/auth/authSlice';
import { authenticatedState2 } from '../fixtures/authFixtures';
import { banda1 } from '../fixtures/bandaFixtures';
import { testUserCredentials2 } from '../fixtures/testUser';
import { directivo1 } from '../fixtures/directivoFixtures';
import { musico1 } from '../fixtures/musicoFixtures';


const storeAutenticado = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: authenticatedState2
    }
});

describe('Pruebas en el  <Estudio />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('Debe mostrar el componente correctamente', async() => {
        

        
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Plantilla tipo={"Músicos"} musicos={ {'Corneta': [musico1]}} usuarios={ {'Corneta': [testUserCredentials2]}} />
                    </MemoryRouter>
                </Provider>
            );
        });
        
        const boton = screen.getByText("Corneta");
        expect(boton).not.toBe(undefined);

    });

    test('Debe mostrar el componente correctamente', async() => {
        

        
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Plantilla tipo={"Directivos"} directivo={ {'Presidente': [directivo1]}} usuarios={ {'Presidente': [testUserCredentials2]} } />
                    </MemoryRouter>
                </Provider>
            );
        });
        
        const boton = screen.getByLabelText("upload picture");
        expect(boton).not.toBe(undefined);

    });

    
    

    
});