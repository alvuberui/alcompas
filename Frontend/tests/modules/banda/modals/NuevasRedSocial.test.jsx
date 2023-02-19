import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { useRedesSocialesStore } from '../../../../src/hooks';
import { NuevasRedSocial } from '../../../../src/modules/banda/modals/NuevasRedSocial';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState2 } from '../../../fixtures/authFixtures';


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


jest.mock('../../../../src/hooks/useRedesSocialesStore');


describe('Pruebas en <NuevasRedSocial />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente', async() => {

        useRedesSocialesStore.mockReturnValue({
            errores: '',
            crearRedSocial: jest.fn(),
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <NuevasRedSocial open />
                    </MemoryRouter>
                </Provider>
            );
        });
        const texto = screen.getByText('Añadir Red Social');
        expect( texto ).not.toBe( undefined);   
        const boton = screen.getByLabelText('enviar');
        fireEvent.click( boton );
    });

    test('Si modal esta cerrado NO debe de mostrar el componente correctamente', async() => {

        useRedesSocialesStore.mockReturnValue({
            errores: '',
            crearRedSocial: jest.fn(),
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <NuevasRedSocial open={false} />
                    </MemoryRouter>
                </Provider>
            ); 
        }); 
        waitFor(() => {
            const texto = screen.findAllByAltText('Añadir Red Social');
      
            expect( texto ).toBe( new Object() ); 
        });
    });
});