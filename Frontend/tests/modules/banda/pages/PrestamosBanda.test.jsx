import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, useParams } from 'react-router-dom';
import { MisBandas } from '../../../../src/modules/banda/pages/MisBandas';
import { useAuthStore, useDirectivosStore, usePrestamosStore  } from '../../../../src/hooks';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState } from '../../../fixtures/authFixtures';
import { banda1, banda2 } from '../../../fixtures/bandaFixtures';
import { directivo1 } from '../../../fixtures/directivoFixtures';
import { noticia1 } from '../../../fixtures/anuncioFixtures';
import { instrumento1 } from '../../../fixtures/instrumentoFixtures';
import { Instrumentos } from '../../../../src/modules/banda/pages/Instrumentos';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { prestamo } from '../../../fixtures/prestamoFixtures';
import { PrestamosBanda } from '../../../../src/modules/banda/pages/PrestamosBanda';

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
jest.mock('../../../../src/hooks/usePrestamosStore');

describe('Pruebas en <Instrumentos />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user
        });

        

        useDirectivosStore.mockReturnValue({
            getDirectivoByUserId: jest.fn().mockReturnValue( [directivo1] ),
        });

        usePrestamosStore.mockReturnValue({
            obtenerTodosByBanda: jest.fn().mockReturnValue( [prestamo,prestamo,prestamo,prestamo,prestamo,prestamo,prestamo,prestamo,prestamo,prestamo,prestamo,prestamo] ),
        });
        
        act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                            <PrestamosBanda    />
                    </MemoryRouter>
                </Provider>
            );
        });
        await  waitFor(() => {
            expect( screen.getByText('Administración de préstamos')).not.toBe( undefined);
        
        });
        
    
    });
});