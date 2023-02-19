import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Estudio, Experiencia, Instrumento, MenuFlotante } from '../../src/Components';
import { authSlice } from '../../src/store/auth/authSlice';
import { authenticatedState2, notAuthenticatedState, authenticatedState } from '../fixtures/authFixtures';
import {  useAuthStore, useInstrumentosStore } from '../../src/hooks';
import { testUserCredentials2 } from '../fixtures/testUser';
import {banda1} from '../fixtures/bandaFixtures';
import { directivo1 } from '../fixtures/directivoFixtures';
import { AñadirInstrumentoModal } from '../../src/modules/user';


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

        
        act(() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <MenuFlotante/>
                    </MemoryRouter>
                </Provider>
            );
        });
        
        const boton = screen.getByText("Instrumentos");
        expect(boton).not.toBe(undefined);
        fireEvent.click(boton);
    });
});