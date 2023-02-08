import { configureStore } from '@reduxjs/toolkit';
import { act, render, screen, waitFor } from '@testing-library/react';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { AdministrarBandas } from '../../../../src/modules/admin';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState2, notAuthenticatedState, authenticatedState } from '../../../fixtures/authFixtures';
import { useAuthStore, useUploadsStore, useBandasStore } from '../../../../src/hooks';
import { testUserCredentials2 } from '../../../fixtures/testUser';

const store = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: notAuthenticatedState
    }
});

const storeAutenticado = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: authenticatedState2
    }
});
jest.mock('../../../../src/hooks/useAuthStore');



describe('Pruebas en el  <AdministrarBandas />', () => {

    beforeEach(() => jest.clearAllMocks() );

    

    test('No debe mostrar el componente al no ser usuario autenticado', async() => {
        useAuthStore.mockReturnValue({
            getUserByiD: jest.fn().mockReturnValue(testUserCredentials2),
            user: testUserCredentials2
        });
      
        act(() => {
            
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <AdministrarBandas />
                    </MemoryRouter>
                </Provider>
            );
        });

            setTimeout(() => {
                // Componente inicio de invitado
                const btnSiguiente = screen.getByLabelText('iniciar');
                expect( btnSiguiente ).not.toBe( undefined);
            }, 1000);
    });


    test('Debe de mostrar el componente correctamente', async() => {
        useAuthStore.mockReturnValue({
          getUserByiD: jest.fn().mockReturnValue(testUserCredentials2),
          user: testUserCredentials2
        });
        
        const useStateSpy = jest.spyOn(React, 'useState');
        useStateSpy.mockImplementation((initialState) => [initialState, jest.fn()]);
        
        act(() => {
          render(
            <Provider store={ storeAutenticado }>
              <MemoryRouter>
                <AdministrarBandas />
              </MemoryRouter>
            </Provider>
          );
        });

        await waitFor(() => {
            // Componente inicio de invitado
            const btnSiguiente = screen.getByLabelText('h3');
            expect( btnSiguiente ).not.toBe( undefined);
        });
    });
});