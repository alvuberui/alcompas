import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Instrumento } from '../../src/Components';
import { useAuthStore, useInstrumentosStore, usePrestamosStore } from '../../src/hooks';
import { authSlice } from '../../src/store/auth/authSlice';
import { authenticatedState2 } from '../fixtures/authFixtures';
import { testUserCredentials2 } from '../fixtures/testUser';
import { banda1 } from '../fixtures/bandaFixtures';
import { instrumento1 } from '../fixtures/instrumentoFixtures';
import { prestamo } from '../fixtures/prestamoFixtures';


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
jest.mock('../../src/hooks/usePrestamosStore');

describe('Pruebas en el  <Estudio />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('Debe mostrar el componente correctamente', async() => {
        useInstrumentosStore.mockReturnValue({
            eliminarInstrumento: jest,
        });

        useAuthStore.mockReturnValue({
            getUserByiD: jest.fn().mockReturnValue( testUserCredentials2),
        });

        usePrestamosStore.mockReturnValue({
            getPrestamoActivoByReferencia: jest.fn().mockReturnValue( prestamo),
            cancelarPrestamo: jest.fn(),
        });

        
         act(() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Instrumento  iguales={true}/>
                    </MemoryRouter>
                </Provider>
            );
        });
         waitFor(() => {
            const boton = screen.getByText("Editar");
            expect(boton).not.toBe(undefined);
            fireEvent.click(boton);
            const prestar = screen.getByText("Prestar");
            expect(prestar).not.toBe(undefined);
            fireEvent.click(prestar);
            
            

        });
    });

    test('Debe mostrar el componente correctamente eliminando', async() => {
        useInstrumentosStore.mockReturnValue({
            eliminarInstrumento: jest,
        });

        useAuthStore.mockReturnValue({
            getUserByiD: jest.fn().mockReturnValue( testUserCredentials2),
        });

        
         act(() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Instrumento  banda={banda1} eliminar={jest.fn()} instrumento={instrumento1} marca={"marca"} modelo={"modelo"} numeroSerie={"fwefwefwefew"} setInstrumentos={jest.fn()} usuario={testUserCredentials2} _id={"rgergerger"} iguales={true}/>
                    </MemoryRouter>
                </Provider>
            );
        });
            waitFor(() => {
            const boton = screen.getByLabelText("Eliminar");
            expect(boton).not.toBe(undefined);
            boton.click();
            const cancelar = screen.getByLabelText("Cancelar");
            expect(cancelar).not.toBe(undefined);
            cancelar.click();
            const ff = screen.getByLabelText("Cafwefwefncelar");
            });
    });

    
});