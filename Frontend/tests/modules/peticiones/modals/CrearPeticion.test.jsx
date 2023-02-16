import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import {  useAuthStore, useBandasStore, useDirectivosStore, usePeticionesStore } from '../../../../src/hooks';
import { CrearPeticion } from '../../../../src/modules/peticiones/modals/CrearPeticion';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { directivo1 } from '../../../fixtures/directivoFixtures';

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
jest.mock('../../../../src/hooks/usePeticionesStore');
jest.mock('../../../../src/hooks/useDirectivosStore');

describe('Pruebas en <CrearPeticion />', () => {
    
    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user,
            getUserByUsername: jest.fn().mockReturnValue( authenticatedState2.user ),
            getAllUsers: jest.fn().mockReturnValue( [authenticatedState2.user ] ),
        });

        useDirectivosStore.mockReturnValue({
            getDirectivoByUserId: jest.fn().mockReturnValue( directivo1 ),
        });

        usePeticionesStore.mockReturnValue({
            crearPeticion: jest.fn(),
            errores: [],
            setErrores: jest.fn(),
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <CrearPeticion open />
                    </MemoryRouter>
                </Provider>
            );
        });
        const texto = screen.getByText('Crear Petición');
        expect( texto ).not.toBe( undefined);  
        
        const boton = screen.getByLabelText('enviar');
        fireEvent.click( boton );
    });
});