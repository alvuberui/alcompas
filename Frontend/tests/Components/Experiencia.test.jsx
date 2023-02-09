import { configureStore } from '@reduxjs/toolkit';
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Experiencia } from '../../src/Components';
import { useBandasStore } from '../../src/hooks';
import { authSlice } from '../../src/store/auth/authSlice';
import { authenticatedState2 } from '../fixtures/authFixtures';
import { banda1 } from '../fixtures/bandaFixtures';
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


describe('Pruebas en el  <Estudio />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('Debe mostrar el componente correctamente', async() => {
        useBandasStore.mockReturnValue({
            getBandaById: jest.fn().mockReturnValue( banda1),
        });

        
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Experiencia  experiencia={directivo1}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        
        const boton = screen.getByText("Fecha final:");
        expect(boton).not.toBe(undefined);
    });

    
});