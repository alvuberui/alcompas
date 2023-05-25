import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Comentario } from '../../src/Components/Comentario';
import { useVestimentasStore, usePrestamosStore } from '../../src/hooks';
import { authSlice } from '../../src/store/auth/authSlice';
import { authenticatedState2 } from '../fixtures/authFixtures';
import { testUserCredentials2 } from '../fixtures/testUser';
import { comentario1 } from '../fixtures/comentarioFixtures';
import { prestamo } from '../fixtures/prestamoFixtures';
import { Vestimenta } from '../../src/Components/Vestimenta';
import { banda1 } from '../fixtures/bandaFixtures';
import { vestimenta } from '../fixtures/vestimentaFixtures';
import { AñadirVestimenta } from '../../src/modules/banda/modals/AñadirVestimenta';
import { NuevoPrestamo } from '../../src/modules/banda/modals/NuevoPrestamo';


const storeAutenticado = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: authenticatedState2
    }
});
jest.mock('../../src/hooks/useVestimentasStore');
jest.mock('../../src/hooks/usePrestamosStore');
// mockear añadir vestimenta
jest.mock('../../src/modules/banda/modals/AñadirVestimenta');
jest.mock('../../src/modules/banda/modals/NuevoPrestamo');

describe('Pruebas en el  <Buscador />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('Debe mostrar el componente correctamente', async() => {
        useVestimentasStore.mockReturnValue({
            eliminarVestimenta: jest.fn()
        });

        usePrestamosStore.mockReturnValue({
            getPrestamoActivoByReferencia: jest.fn().mockReturnValue(prestamo),
            cancelarPrestamo: jest.fn()
        });

        
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Vestimenta banda={banda1} eliminar={jest.fn()} iguales={true} setVestimentas={jest.fn()} vestimenta={vestimenta}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        const boton = screen.getByText("Comentario del préstamo:")
        expect(boton).not.toBe(null);
        const cancelar = screen.getByLabelText("Cancelar");
        fireEvent.click(cancelar);

        
    });

    test('Debe mostrar el componente correctamente sin prestamo', async() => {
        useVestimentasStore.mockReturnValue({
            eliminarVestimenta: jest.fn()
        });

        usePrestamosStore.mockReturnValue({
            getPrestamoActivoByReferencia: jest.fn().mockReturnValue(undefined),
            cancelarPrestamo: jest.fn()
        });

        
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Vestimenta banda={banda1} eliminar={jest.fn()} iguales={true} setVestimentas={jest.fn()} vestimenta={vestimenta}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        const prestar = screen.getByLabelText("Prestar");
        fireEvent.click(prestar);
        const editar = screen.getByLabelText("Editar");
        fireEvent.click(editar);
        const eliminar = screen.getByLabelText("Eliminar");
        fireEvent.click(eliminar);

        
    });

    test('Debe mostrar el componente correctamente de loading', async() => {
        useVestimentasStore.mockReturnValue({
            eliminarVestimenta: jest.fn()
        });

        usePrestamosStore.mockReturnValue({
            getPrestamoActivoByReferencia: jest.fn().mockReturnValue(""),
            cancelarPrestamo: jest.fn()
        });

        
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Vestimenta banda={banda1} eliminar={jest.fn()} iguales={true} setVestimentas={jest.fn()} vestimenta={vestimenta}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        const boton = screen.getByLabelText("loading")
        expect(boton).not.toBe(null);
        

        
    });
});