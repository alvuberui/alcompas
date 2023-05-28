import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, useParams } from 'react-router-dom';
import { MisBandas } from '../../../../src/modules/banda/pages/MisBandas';
import { useAuthStore, useDirectivosStore, useInstrumentosStore  } from '../../../../src/hooks';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState } from '../../../fixtures/authFixtures';
import { banda1, banda2 } from '../../../fixtures/bandaFixtures';
import { directivo1 } from '../../../fixtures/directivoFixtures';
import { noticia1 } from '../../../fixtures/anuncioFixtures';
import { instrumento1 } from '../../../fixtures/instrumentoFixtures';
import { Instrumentos } from '../../../../src/modules/banda/pages/Instrumentos';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { AñadirInstrumentoModal } from '../../../../src/modules/user/modals/AñadirInstrumentoModal';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => (fn) => fn(),
}));

const store = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: authenticatedState
    }
})

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn().mockReturnValue({ bandaId: "63c850f1f4f9246bd4ecb661" }),
}));
jest.mock('../../../../src/modules/user/modals/AñadirInstrumentoModal');
jest.mock('../../../../src/hooks/useAuthStore');
jest.mock('../../../../src/hooks/useDirectivosStore');
jest.mock('../../../../src/hooks/useInstrumentosStore');

describe('Pruebas en <Instrumentos />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user
        });

        

        useDirectivosStore.mockReturnValue({
            getDirectivoByUserId: jest.fn().mockReturnValue( [directivo1] ),
        });

        useInstrumentosStore.mockReturnValue({
            getTodosInstrumentosByBanda: jest.fn().mockReturnValue( [instrumento1] ),
            obtenerTodosConPrestamosByBanda: jest.fn().mockReturnValue( [instrumento1] ),
            obtenerTodosInstrumentosSinPrestarByBanda : jest.fn().mockReturnValue( [instrumento1] )
        });
        
        act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                            <Instrumentos   />
                    </MemoryRouter>
                </Provider>
            );
        });
         waitFor(() => {
            expect( screen.getByText('Administración de instrumentos')).not.toBe( undefined);
            const boton = screen.getByLabelText('añadir');
            console.log(boton)
            fireEvent.click(boton);
            const sinprestar = screen.getByLabelText('sinprestar');
            fireEvent.click(sinprestar);
            const prestados = screen.getByLabelText('prestados');
            fireEvent.click(prestados);
            const todos = screen.getByLabelText('todos');
            fireEvent.click(todos);
        });
        
    
    });
/*
    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user
        });

        

        useDirectivosStore.mockReturnValue({
            getDirectivoByUserId: jest.fn().mockReturnValue( [directivo1] ),
        });

        useInstrumentosStore.mockReturnValue({
            getTodosInstrumentosByBanda: jest.fn().mockReturnValue( [] ),
            obtenerTodosConPrestamosByBanda: jest.fn().mockReturnValue( [] ),
            obtenerTodosInstrumentosSinPrestarByBanda : jest.fn().mockReturnValue( [] )
        });
        
        act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                            <Instrumentos   />
                    </MemoryRouter>
                </Provider>
            );
        });
         await waitFor(() => {
            expect( screen.getByText('Administración de instrumentos')).not.toBe( undefined);
            const boton = screen.getByLabelText('añadir');
            console.log(boton)
            fireEvent.click(boton);
            const sinprestar = screen.getByLabelText('sinprestar');
            fireEvent.click(sinprestar);
            const prestados = screen.getByLabelText('prestados');
            fireEvent.click(prestados);
            const todos = screen.getByLabelText('todos');
            fireEvent.click(todos);
        });
        
    
    }); */
});