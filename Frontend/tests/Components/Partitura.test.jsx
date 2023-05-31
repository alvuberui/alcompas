import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Comentario } from '../../src/Components/Comentario';
import { useAuthStore, useObrasStore, usePartiturasStore } from '../../src/hooks';
import { authSlice } from '../../src/store/auth/authSlice';
import { authenticatedState2 } from '../fixtures/authFixtures';
import { testUserCredentials2 } from '../fixtures/testUser';
import { comentario1 } from '../fixtures/comentarioFixtures';
import { partitura } from '../fixtures/partituraFixtures';
import { obra } from '../fixtures/obraFixtures';
import { Obra } from '../../src/Components/Obra';
import { Partitura } from '../../src/Components/Partitura';


const storeAutenticado = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: authenticatedState2
    }
});
jest.mock('../../src/hooks/usePartiturasStore');

describe('Pruebas en el  <Partitura />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('Debe mostrar el componente correctamente', async() => {
        usePartiturasStore.mockReturnValue({
            getPartituraById: jest.fn(partitura),
            eliminarPartitura: jest.fn(),
        });
        
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Partitura eliminar={jest.fn()} esArchivero={true} partitura={partitura} setPartitura={jest.fn()} />
                    </MemoryRouter>
                </Provider>
            );
        });
        const tarjeta = screen.getByLabelText("partitura");
        fireEvent.mouseOver(tarjeta);
        fireEvent.mouseOut(tarjeta);
        const texto = screen.getByText("Tuba Primero");
        expect(texto).not.toBeNull();
        const boton = screen.getByLabelText("settings");
        fireEvent.click(boton); 

    });

    
});