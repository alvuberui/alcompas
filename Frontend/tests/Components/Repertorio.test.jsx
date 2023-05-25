import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Comentario } from '../../src/Components/Comentario';
import { useAuthStore, useObrasStore, useRepertoriosStore } from '../../src/hooks';
import { authSlice } from '../../src/store/auth/authSlice';
import { authenticatedState2 } from '../fixtures/authFixtures';
import { testUserCredentials2 } from '../fixtures/testUser';
import { comentario1 } from '../fixtures/comentarioFixtures';
import { partitura } from '../fixtures/partituraFixtures';
import { obra } from '../fixtures/obraFixtures';
import { Obra } from '../../src/Components/Obra';
import { repertorio } from '../fixtures/repertorioFixtures';
import { Repertorio } from '../../src/Components/Repertorio';


const storeAutenticado = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: authenticatedState2
    }
});
jest.mock('../../src/hooks/useObrasStore');
jest.mock('../../src/hooks/useRepertoriosStore');

describe('Pruebas en el  <Obra />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('Debe mostrar el componente correctamente', async() => {
        useObrasStore.mockReturnValue({
            getAllObrasByRepertorioId: jest.fn().mockReturnValue([obra])
        });

        useRepertoriosStore.mockReturnValue({
            eliminarRepertorio: jest.fn(),
        });
        
        await act(async() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Repertorio eliminar={jest.fn()} esArchivero={true} repertorio={repertorio} setObras={jest.fn()} setRepertorio={jest.fn()}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        const tarjeta = screen.getByLabelText("repertorio");
        fireEvent.mouseOver(tarjeta);
        fireEvent.mouseOut(tarjeta);
        const texto = screen.getByText("Repertorio 1");
        expect(texto).not.toBeNull();
        const boton = screen.getByLabelText("settings");
        fireEvent.click(boton); 

    });

    
});