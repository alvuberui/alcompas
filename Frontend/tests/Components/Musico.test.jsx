import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Musico } from '../../src/Components';
import { useDirectivosStore, useMusicosStore, useContratadosStore, useArchiverosStore } from '../../src/hooks';
import { authSlice } from '../../src/store/auth/authSlice';
import { authenticatedState2 } from '../fixtures/authFixtures';
import { banda1 } from '../fixtures/bandaFixtures';
import { testUserCredentials2 } from '../fixtures/testUser';
import { contratadoFixture } from '../fixtures/contratadoFixture';
import { archivero1 } from '../fixtures/archiveroFixtures';


const storeAutenticado = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: authenticatedState2
    }
});

jest.mock('../../src/hooks/useMusicosStore');
jest.mock('../../src/hooks/useDirectivosStore');
jest.mock('../../src/hooks/useContratadosStore');
jest.mock('../../src/hooks/useArchiverosStore');

describe('Pruebas en el  <Estudio />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('Debe mostrar el componente correctamente', async() => {
        useMusicosStore.mockReturnValue({
            finalizarMusico: jest.fn(),
        });

        useDirectivosStore.mockReturnValue({
            finalizarDirectivo: jest.fn(),
            getDirectivosByBandaId: jest.fn().mockReturnValue([banda1]),
        });

        useContratadosStore.mockReturnValue({
            deleteContratado: jest.fn(),
            getContratadosByEnveto: jest.fn().mockReturnValue([contratadoFixture]),
        });

        useArchiverosStore.mockReturnValue({
            finalizarArchivero: jest.fn(),
            getArchiverosByBandaId: jest.fn().mockReturnValue([archivero1]),
        });

        
        act(() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Musico usuario={testUserCredentials2} directivo={true} tipo={"musico"} />
                    </MemoryRouter>
                </Provider>
            );
        });
        
        const boton = screen.getByLabelText("upload picture");
        expect(boton).not.toBe(undefined);
        fireEvent.click(boton);
    });

    test('Debe mostrar el componente correctamente como directivo', async() => {
        useMusicosStore.mockReturnValue({
            finalizarMusico: jest.fn(),
        });

        useDirectivosStore.mockReturnValue({
            finalizarDirectivo: jest.fn(),
            getDirectivosByBandaId: jest.fn().mockReturnValue([banda1]),
        });

        
        act(() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Musico usuario={testUserCredentials2} directivo={true} tipo={"directivo"} />
                    </MemoryRouter>
                </Provider>
            );
        });
        
        const boton = screen.getByLabelText("upload picture");
        expect(boton).not.toBe(undefined);
        fireEvent.click(boton);
    });

    test('Debe mostrar el componente correctamente como archivero', async() => {
        useMusicosStore.mockReturnValue({
            finalizarMusico: jest.fn(),
        });

        useDirectivosStore.mockReturnValue({
            finalizarDirectivo: jest.fn(),
            getDirectivosByBandaId: jest.fn().mockReturnValue([banda1]),
        });

        
        act(() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Musico usuario={testUserCredentials2} directivo={true} tipo={"archivero"} />
                    </MemoryRouter>
                </Provider>
            );
        });
        
        const boton = screen.getByLabelText("upload picture");
        expect(boton).not.toBe(undefined);
        fireEvent.click(boton);
        
    });
    test('Debe mostrar el componente correctamente como archivero', async() => {
        useMusicosStore.mockReturnValue({
            finalizarMusico: jest.fn(),
        });

        useDirectivosStore.mockReturnValue({
            finalizarDirectivo: jest.fn(),
            getDirectivosByBandaId: jest.fn().mockReturnValue([banda1]),
        });

        
        act(() => {
            
            render(
                <Provider store={ storeAutenticado }>
                    <MemoryRouter>
                        <Musico usuario={testUserCredentials2} directivo={true} tipo={"archivero"} contratado={contratadoFixture} contratadoId={contratadoFixture._id}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        
        const contratado = screen.getByLabelText("contratado");
        fireEvent.click(contratado);
    });

    
});