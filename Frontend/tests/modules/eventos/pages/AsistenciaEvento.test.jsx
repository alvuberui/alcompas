import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, useParams } from 'react-router-dom';
import { MisBandas } from '../../../../src/modules/banda/pages/MisBandas';
import { useAuthStore, useDirectivosStore, useEventosStore, useAsistenciasStore, useArchiverosStore, useContratadosStore  } from '../../../../src/hooks';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState } from '../../../fixtures/authFixtures';
import { banda1, banda2 } from '../../../fixtures/bandaFixtures';
import { directivo1, directivo2 } from '../../../fixtures/directivoFixtures';
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
import { procesionFixture } from '../../../fixtures/eventoFixture';
import { asistencia1 } from '../../../fixtures/asistenciaFixtures';
import { archivero1 } from '../../../fixtures/archiveroFixtures';
import {contratadoFixture } from '../../../fixtures/contratadoFixture';
import { AsistenciaEvento } from '../../../../src/modules/eventos';
import {testUserCredentials3} from '../../../fixtures/testUser';
import { Musico } from '../../../../src/Components/Musico';


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

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
  }));

jest.mock('../../../../src/hooks/useAuthStore');
jest.mock('../../../../src/hooks/useDirectivosStore');
jest.mock('../../../../src/hooks/useEventosStore');
jest.mock('../../../../src/hooks/useAsistenciasStore');
jest.mock('../../../../src/hooks/useArchiverosStore');
jest.mock('../../../../src/hooks/useContratadosStore');




describe('Pruebas en <Vestimentas />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user
        });

        useParams.mockReturnValue({ tipoEvento: 'Procesión', eventoId: procesionFixture._id });

        useDirectivosStore.mockReturnValue({
            getDirectivoByUserId: jest.fn().mockReturnValue( [directivo1] ),
        });

        useEventosStore.mockReturnValue({
            getByTipoId: jest.fn().mockReturnValue( [procesionFixture] ),
        });

        useAsistenciasStore.mockReturnValue({
            getTodasAsistenciasByEvento: jest.fn().mockReturnValue( { ['Directivo: ,Presidente']: [testUserCredentials3, asistencia1]} ),
        });

        useArchiverosStore.mockReturnValue({
            getArchiverosByUserId: jest.fn().mockReturnValue( [archivero1] ),
        });

        useContratadosStore.mockReturnValue({
            getContratadosByEnveto: jest.fn().mockReturnValue( [contratadoFixture] ),
        });
        
         act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                            <AsistenciaEvento     />
                    </MemoryRouter>
                </Provider>
            );
        });
        await  waitFor (() => {
            const contratado = screen.getByLabelText('contratado');
            fireEvent.click(contratado);
        });
            
        
       
    });
});