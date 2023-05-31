import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, useParams } from 'react-router-dom';
import { MisBandas } from '../../../../src/modules/banda/pages/MisBandas';
import { useAuthStore, useDirectivosStore, useVestimentasStore  } from '../../../../src/hooks';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState } from '../../../fixtures/authFixtures';
import { banda1, banda2 } from '../../../fixtures/bandaFixtures';
import { directivo2 } from '../../../fixtures/directivoFixtures';
import { noticia1 } from '../../../fixtures/anuncioFixtures';
import { instrumento1 } from '../../../fixtures/instrumentoFixtures';
import { Instrumentos } from '../../../../src/modules/banda/pages/Instrumentos';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { prestamo } from '../../../fixtures/prestamoFixtures';
import { PrestamosBanda } from '../../../../src/modules/banda/pages/PrestamosBanda';
import { transaccion } from '../../../fixtures/transaccionFixtures'; 
import { Transacciones } from '../../../../src/modules/banda/pages/Transacciones';
import { Documento } from '../../../../src/Components';
import { StyleSheet } from '@react-pdf/renderer';
import { PDFDownloadLink } from "@react-pdf/renderer";
import { vestimenta } from '../../../fixtures/vestimentaFixtures';
import { Vestimentas } from '../../../../src/modules/banda/pages/Vestimentas';


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

jest.mock('../../../../src/hooks/useAuthStore');
jest.mock('../../../../src/hooks/useDirectivosStore');
jest.mock('../../../../src/hooks/useVestimentasStore');

describe('Pruebas en <Vestimentas />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user
        });

        

        useDirectivosStore.mockReturnValue({
            getDirectivoByUserId: jest.fn().mockReturnValue( [directivo2] ),
        });

        useVestimentasStore.mockReturnValue({
            getAllVestimentasByBanda: jest.fn().mockReturnValue( [vestimenta] ),
            obtenerTodosConPrestamosByBanda: jest.fn().mockReturnValue( [vestimenta] ),
            obtenerTodosVestimentasSinPrestarByBanda: jest.fn().mockReturnValue( [vestimenta] ),
        });
        
        act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                            <Vestimentas     />
                    </MemoryRouter>
                </Provider>
            );
        });
        await  waitFor(() => {
            expect( screen.getByText('Administración de vestimentas')).not.toBe( undefined);
            const añadir = screen.getByLabelText('Añadir');
            fireEvent.click(añadir);
            
            
            const ultimo = screen.getByLabelText('prestadas');
            fireEvent.click(ultimo);
            
        
        });

        await  waitFor(() => {
            const todos = screen.getByLabelText('todas');
            fireEvent.click(todos);
        });

        await  waitFor(() => {
            const todos = screen.getByLabelText('sinprestar');
            fireEvent.click(todos);
        });
    
    });

    test('debe de mostrar el componente correctamente sin vestimenta', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user
        });

        

        useDirectivosStore.mockReturnValue({
            getDirectivoByUserId: jest.fn().mockReturnValue( [directivo2] ),
        });

        useVestimentasStore.mockReturnValue({
            getAllVestimentasByBanda: jest.fn().mockReturnValue( [] ),
            obtenerTodosConPrestamosByBanda: jest.fn().mockReturnValue( [] ),
            obtenerTodosVestimentasSinPrestarByBanda: jest.fn().mockReturnValue( [] ),
        });
        
        act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                            <Vestimentas     />
                    </MemoryRouter>
                </Provider>
            );
        });
        await  waitFor(() => {
            expect( screen.getByText('Administración de vestimentas')).not.toBe( undefined);
            const añadir = screen.getByLabelText('Añadir');
            fireEvent.click(añadir);
            
            
            const ultimo = screen.getByLabelText('prestadas');
            fireEvent.click(ultimo);
            
        
        });

        await  waitFor(() => {
            const todos = screen.getByLabelText('todas');
            fireEvent.click(todos);
        });

        await  waitFor(() => {
            const todos = screen.getByLabelText('sinprestar');
            fireEvent.click(todos);
        });
    
    });

   
});