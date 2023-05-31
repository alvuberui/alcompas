import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Comentario } from '../../src/Components/Comentario';
import { useAuthStore, useComentariosStore } from '../../src/hooks';
import { authSlice } from '../../src/store/auth/authSlice';
import { authenticatedState2 } from '../fixtures/authFixtures';
import { testUserCredentials2 } from '../fixtures/testUser';
import { comentario1 } from '../fixtures/comentarioFixtures';
import { prestamo } from '../fixtures/prestamoFixtures';
import { Prestamo } from '../../src/Components/Prestamo';


const storeAutenticado = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: authenticatedState2
    }
});

describe('Pruebas en el  <Prestamo />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('Debe mostrar el componente correctamente', async() => {
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Prestamo prestamo={prestamo} tipo={"banda"}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        const boton = screen.getByText("30/10/2020")
        expect(boton).not.toBeNull();

        
    });

    test('Debe mostrar el componente correctamente', async() => {
        await act(async() => {
            prestamo.referencia = { banda: { _id: "123456789012345678901234"}}
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Prestamo prestamo={prestamo} tipo={"usuario"}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        const boton = screen.getByText("30/10/2020")
        expect(boton).not.toBeNull();

        
    });

    test('Debe mostrar el componente de loading correctamente', async() => {
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Prestamo prestamo={undefined} tipo={"usuario"}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        const boton = screen.getByLabelText("loading")
        expect(boton).not.toBeNull();

        
    });

    test('Debe mostrar el componente de sin comentario y tipo instrumento correctamente', async() => {
        await act(async() => {
            prestamo.tipo = "Instrumento";
            prestamo.comentario = "Hola";
            prestamo.marca = "Yamaha";
            prestamo.modelo = "YTR-2330";
            prestamo.numeroSerie = "123456789";
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Prestamo prestamo={prestamo} tipo={"usuario"}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        const boton = screen.getByText("Hola")
        expect(boton).not.toBeNull();

        
    });

});