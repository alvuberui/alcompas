import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import {  useInstrumentosStore, useAuthStore } from '../../../../src/hooks';
import { AñadirInstrumentoModal } from '../../../../src/modules/user';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { instrumento1, instrumento2 } from '../../../fixtures/instrumentoFixtures';
import { banda1 } from '../../../fixtures/bandaFixtures';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => (fn) => fn(),
}));

const store = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: authenticatedState2
    }
})

jest.mock('../../../../src/hooks/useAuthStore');
jest.mock('../../../../src/hooks/useInstrumentosStore');

describe('Pruebas en <AñadirEstudioModal />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user,
        });

        useInstrumentosStore.mockReturnValue({
            crearInstrumentoUsuario: jest.fn(),
            errores: [],
            setErrores: jest.fn(),
            getInstrumentosById: jest.fn().mockReturnValue( instrumento2 ),
            editarInstrumentoUsuario: jest.fn(),
            crearInstrumentoBanda: jest.fn(),
            editarInstrumentoBanda: jest.fn(),
            
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <AñadirInstrumentoModal open setInstrumentos={ jest.fn() } setOpen={jest.fn()}/>
                    </MemoryRouter>
                </Provider>
            );
        });

        await act(async() => {
            const texto = screen.getByText('Añadir Instrumento');
            expect( texto ).not.toBe( undefined);   
            const boto = screen.getByLabelText('crear');
            fireEvent.click( boto );
        });
    });

    

    test('debe de mostrar el componente correctamente banda', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user,
        });

        useInstrumentosStore.mockReturnValue({
            crearInstrumentoUsuario: jest.fn(),
            errores: [],
            setErrores: jest.fn(),
            getInstrumentosById: jest.fn().mockReturnValue( [instrumento2] ),
            editarInstrumentoUsuario: jest.fn(),
            crearInstrumentoBanda: jest.fn(),
            editarInstrumentoBanda: jest.fn(),
            
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <AñadirInstrumentoModal banda={banda1} instrumentoId={instrumento2._id} open={true} setInstrumentos={jest.fn()} setOpen={jest.fn()}/>
                    </MemoryRouter>
                </Provider>
            );
        });

     
            const boto = screen.getByLabelText('crear');
            fireEvent.click( boto );
     
    });


    
});