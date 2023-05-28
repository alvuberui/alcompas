import { configureStore } from '@reduxjs/toolkit';
import { act, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { UpdateBandaForm } from '../../../../src/modules/banda';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { useBandasStore, useDirectivosStore, useAuthStore } from '../../../../src/hooks';
import { banda1 } from '../../../fixtures/bandaFixtures';
import { testUserCredentials2 } from '../../../fixtures/testUser';
import { directivo1 } from '../../../fixtures/directivoFixtures';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => (fn) => fn(),
}));

jest.mock("sweetalert2", () => ({
    fire: jest.fn(),
}));

const store = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: authenticatedState2
    }
})

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn().mockReturnValue({ bandaId: "63c850f1f4f9246bd4ecb661" }),
}));

jest.mock('../../../../src/hooks/useBandasStore');
jest.mock('../../../../src/hooks/useDirectivosStore');
jest.mock('../../../../src/hooks/useAuthStore');


describe('Pruebas en el  <UpdateBandaForm />', () => {

    beforeEach(() => jest.clearAllMocks() );

    

    test('debe de mostrar el componente de PersonalRegsiter correctamente', async() => {

        useAuthStore.mockReturnValue({
            user : testUserCredentials2
        });

        useBandasStore.mockReturnValue({
            editarBandas: jest.fn(),
            mensajeError: '',
            getBandaById: jest.fn().mockReturnValue(banda1),
        });

        useDirectivosStore.mockReturnValue({
            getDirectivoByUserId: jest.fn().mockReturnValue([directivo1]),
        });

        act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <UpdateBandaForm />
                    </MemoryRouter>
                </Provider>
            );
        });

        await waitFor(() => {
            // Crear banda uno
            const btnSiguiente = screen.getByLabelText('link');
            expect( btnSiguiente ).not.toBe( undefined);
            btnSiguiente.click();

            // CrearBanda2
            const direccion = screen.getByLabelText('codigo');
            expect( direccion ).not.toBe( undefined);
            const boton = screen.getByLabelText('link');
            boton.click();

        });

        await waitFor(() => {

            // CrearBanda3
            const usuario = screen.getByLabelText('telefono');
            expect( usuario ).not.toBe( undefined);
            const retroceder3 = screen.getByLabelText('retroceder');
            retroceder3.click();

        });
        await waitFor(() => {
            const retroceder2 = screen.getByLabelText('retroceder');
            retroceder2.click();

        });

        await waitFor(() => {
            // Crear banda uno
            const btnSiguiente = screen.getByLabelText('link');
            expect( btnSiguiente ).not.toBe( undefined);
            btnSiguiente.click();
        });

        await waitFor(() => {
            const boton = screen.getByLabelText('link');
            boton.click();
        });

        await waitFor(() => {
            const usuario = screen.getByLabelText('telefono');
            expect( usuario ).not.toBe( undefined);
            const confirmar = screen.getByLabelText('confirmar');
            confirmar.click();
        });
    });    
});