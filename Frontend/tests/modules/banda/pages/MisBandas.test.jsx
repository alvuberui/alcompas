import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { MisBandas } from '../../../../src/modules/banda/pages/MisBandas';
import { useAuthStore, useBandasStore, useUploadsStore } from '../../../../src/hooks';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState, authenticatedState2 } from '../../../fixtures/authFixtures';
import { banda1, banda2 } from '../../../fixtures/bandaFixtures';
import { Banda } from '../../../../src/Components/Banda';

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
    useParams: jest.fn().mockReturnValue({ nombre: "ejemplo", userId: "63f23b7c574f95917e3595ff" }),
}));

jest.mock('../../../../src/hooks/useUploadsStore');
jest.mock('../../../../src/hooks/useAuthStore');
jest.mock('../../../../src/hooks/useBandasStore');

describe('Pruebas en <MisBandas />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user
        });

        useUploadsStore.mockReturnValue({
            getFotoPerfilBanda: jest.fn().mockReturnValue( "" ),
        });

        

        useBandasStore.mockReturnValue({
            getBandasByUserId: jest.fn().mockReturnValue( [banda1] ),
            getBandasByNombre: jest.fn().mockReturnValue( [banda1] ),
        });
        
        act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                            <MisBandas titulo={"Mis Bandas"}   />
                    </MemoryRouter>
                </Provider>
            );
        });
        await waitFor(() => {
            expect( screen.getByText('Agrupación Musical EJEMPLO')).not.toBe( undefined);
        });
        
    
    });

    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user
        });

        

        useBandasStore.mockReturnValue({
            getBandasByUserId: jest.fn().mockReturnValue( [banda1] ),
            getBandasByNombre: jest.fn().mockReturnValue( [banda1] ),
        });
        
        act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                            <MisBandas    />
                    </MemoryRouter>
                </Provider>
            );
        });
        await  waitFor(() => {
            expect( screen.getByText('Agrupación Musical EJEMPLO')).not.toBe( undefined);
        });
        
    
    });

    test('debe de mostrar el componente correctamente sin bandas', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user
        });

        

        useBandasStore.mockReturnValue({
            getBandasByUserId: jest.fn().mockReturnValue( [] ),
            getBandasByNombre: jest.fn().mockReturnValue( [] ),
        });
        
        act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                            <MisBandas    />
                    </MemoryRouter>
                </Provider>
            );
        });
        await  waitFor(() => {
            expect( screen.getByText('No hay bandas...')).not.toBe( undefined);
        });
        
    
    });


    test('debe de mostrar el componente correctamente loading', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2
        });

        useBandasStore.mockReturnValue({
            getBandasByNombre: jest.fn().mockReturnValue( "" ),
            getBandasByUserId: jest.fn().mockReturnValue( "" ),
        });
        
        act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <MisBandas titulo={"Mis Bandas"}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        await waitFor(() => {
            expect( screen.getByLabelText('loading')).not.toBe( undefined);
        });
        
    });
});