import { configureStore } from '@reduxjs/toolkit';
import { act, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, useParams } from 'react-router-dom';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { UpdateBandaForm } from '../../../../src/modules/banda';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { useEventosStore, useDirectivosStore, useAuthStore } from '../../../../src/hooks';
import { banda1 } from '../../../fixtures/bandaFixtures';
import { testUserCredentials2 } from '../../../fixtures/testUser';
import { directivo1 } from '../../../fixtures/directivoFixtures';
import { procesionFixture, actuacionFixture, ensayoFixture } from '../../../fixtures/eventoFixture';
import { ActualizarEventoForm } from '../../../../src/modules/eventos';


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

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
  }));

jest.mock('../../../../src/hooks/useEventosStore');
jest.mock('../../../../src/hooks/useDirectivosStore');
jest.mock('../../../../src/hooks/useAuthStore');


describe('Pruebas en el  <UpdateBandaForm />', () => {

    beforeEach(() => jest.clearAllMocks() );

    

    test('debe mostrar el componente de ActualizarEvento correctamente', async () => {
        useAuthStore.mockReturnValue({
          user: testUserCredentials2,
        });
    
        useParams.mockReturnValue({ tipoEvento: 'Procesión' });
    
        useEventosStore.mockReturnValue({
          actualizarProcesion: jest.fn().mockReturnValue(procesionFixture),
          actualizarEnsayo: jest.fn().mockReturnValue(procesionFixture),
          actualizarActuacion: jest.fn().mockReturnValue(procesionFixture),
          mensajeError: '',
          getByTipoId: jest.fn().mockReturnValue(procesionFixture),
        });
    
        useDirectivosStore.mockReturnValue({
          getDirectivoByUserId: jest.fn().mockReturnValue([directivo1]),
        });
    
        await act(async () => {
          render(
            <Provider store={store}>
              <MemoryRouter>
                <ActualizarEventoForm />
              </MemoryRouter>
            </Provider>
          );
        });

         waitFor(() => {
            const btnSiguiente = screen.getByLabelText('link');
            expect( btnSiguiente ).not.toBe( undefined);
            btnSiguiente.click();


        });

         waitFor(() => {
            const retroceder3 = screen.getByLabelText('retroceder');
            retroceder3.click();

        });
         waitFor(() => {
            const btnSiguiente = screen.getByLabelText('link');
            expect( btnSiguiente ).not.toBe( undefined);
            btnSiguiente.click();


        });

         waitFor(() => {
            const confirmar = screen.getByLabelText('confirmar');
            expect( confirmar ).not.toBe( undefined);
            confirmar.click();
        });
    }); 
    
    test('debe de mostrar el componente de ActualizarEvento correctamente ensayo', async() => {

        useAuthStore.mockReturnValue({
            user : testUserCredentials2
        });

        useParams.mockReturnValue({ tipoEvento: 'Ensayo' });

        useEventosStore.mockReturnValue({
            actualizarProcesion: jest.fn().mockReturnValue(ensayoFixture),
            actualizarEnsayo: jest.fn().mockReturnValue(ensayoFixture),
            actualizarActuacion: jest.fn().mockReturnValue(ensayoFixture),
            mensajeError: "",
            getByTipoId: jest.fn().mockReturnValue(ensayoFixture),
        });

        useDirectivosStore.mockReturnValue({
            getDirectivoByUserId: jest.fn().mockReturnValue([directivo1]),
        });

        await  act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <ActualizarEventoForm  />
                    </MemoryRouter>
                </Provider>
            );
        });

         waitFor(() => {
            const btnSiguiente = screen.getByLabelText('link');
            expect( btnSiguiente ).not.toBe( undefined);
            btnSiguiente.click();


        });

         waitFor(() => {
            const retroceder3 = screen.getByLabelText('retroceder');
            retroceder3.click();

        });
         waitFor(() => {
            const btnSiguiente = screen.getByLabelText('link');
            expect( btnSiguiente ).not.toBe( undefined);
            btnSiguiente.click();


        });

         waitFor(() => {
            const confirmar = screen.getByLabelText('confirmar');
            expect( confirmar ).not.toBe( undefined);
            confirmar.click();
        });
    });
    
    test('debe de mostrar el componente de ActualizarEvento correctamente actuación', async() => {

        useAuthStore.mockReturnValue({
            user : testUserCredentials2
        });

        useParams.mockReturnValue({ tipoEvento: 'Actuación' });

        useEventosStore.mockReturnValue({
            actualizarProcesion: jest.fn().mockReturnValue(actuacionFixture),
            actualizarEnsayo: jest.fn().mockReturnValue(actuacionFixture),
            actualizarActuacion: jest.fn().mockReturnValue(actuacionFixture),
            mensajeError: "",
            getByTipoId: jest.fn().mockReturnValue(actuacionFixture),
        });

        useDirectivosStore.mockReturnValue({
            getDirectivoByUserId: jest.fn().mockReturnValue([directivo1]),
        });

          act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <ActualizarEventoForm  />
                    </MemoryRouter>
                </Provider>
            );
        });

         await waitFor(() => {
            const btnSiguiente = screen.getByLabelText('link');
            expect( btnSiguiente ).not.toBe( undefined);
            btnSiguiente.click();


        });

         waitFor(() => {
            const retroceder3 = screen.getByLabelText('retroceder');
            retroceder3.click();

        });
         waitFor(() => {
            const btnSiguiente = screen.getByLabelText('link');
            expect( btnSiguiente ).not.toBe( undefined);
            btnSiguiente.click();


        });

         waitFor(() => {
            const confirmar = screen.getByLabelText('confirmar');
            expect( confirmar ).not.toBe( undefined);
            confirmar.click();
        });
    }); 

    test('debe de mostrar el componente de ActualizarEvento correctamente loading', async() => {

        useAuthStore.mockReturnValue({
            user : testUserCredentials2
        });

  

        useEventosStore.mockReturnValue({
            actualizarProcesion: jest.fn().mockReturnValue(actuacionFixture),
            actualizarEnsayo: jest.fn().mockReturnValue(actuacionFixture),
            actualizarActuacion: jest.fn().mockReturnValue(actuacionFixture),
            mensajeError: "",
            getByTipoId: jest.fn().mockReturnValue(actuacionFixture),
        });

        useDirectivosStore.mockReturnValue({
            getDirectivoByUserId: jest.fn().mockReturnValue([directivo1]),
        });

        await  act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <ActualizarEventoForm  />
                    </MemoryRouter>
                </Provider>
            );
        });

         waitFor(() => {
            const btnSiguiente = screen.getByLabelText('loading');
            expect( btnSiguiente ).not.toBe( undefined);
        


        });

         
    }); 
});