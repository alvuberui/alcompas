import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, useParams } from 'react-router-dom';
import { MisBandas } from '../../../../src/modules/banda/pages/MisBandas';
import { useAuthStore, useDirectivosStore, useTransaccionesStore  } from '../../../../src/hooks';
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

jest.mock('@react-pdf/renderer');
StyleSheet.create = jest.fn().mockReturnValue({}); // Mock para StyleSheet.create
PDFDownloadLink.mockImplementation(({ children }) => children); // Mock para PDFDownloadLink


jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn().mockReturnValue({ bandaId: "63c850f1f4f9246bd4ecb661" }),
}));
jest.mock('../../../../src/Components/Documento');
jest.mock('../../../../src/hooks/useAuthStore');
jest.mock('../../../../src/hooks/useDirectivosStore');
jest.mock('../../../../src/hooks/useTransaccionesStore');

describe('Pruebas en <Instrumentos />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente ultimo año', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user
        });

        

        useDirectivosStore.mockReturnValue({
            getDirectivoByUserId: jest.fn().mockReturnValue( [directivo2] ),
        });

        useTransaccionesStore.mockReturnValue({
            getByBanda: jest.fn().mockReturnValue( [transaccion] ),
            deleteById: jest.fn(),
            getTransaccionesUltimoAño: jest.fn().mockReturnValue( [transaccion] ),
        });
        
        act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                            <Transacciones     />
                    </MemoryRouter>
                </Provider>
            );
        });
        await  waitFor(() => {
            expect( screen.getByText('Administración Económica')).not.toBe( undefined);
            const añadir = screen.getByLabelText('Añadir');
            fireEvent.click(añadir);
            
            
            const ultimo = screen.getByLabelText('ultimo');
            fireEvent.click(ultimo);
            
        
        });

        await  waitFor(() => {
            const todos = screen.getByLabelText('todas');
            fireEvent.click(todos);
            
            
        
        });

        await  waitFor(() => {
            const eliminar = screen.getByLabelText('delete');
            fireEvent.click(eliminar);
            const editar = screen.getByLabelText('editar');
            fireEvent.click(editar);
        });
    
    });

   
});