import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { useAnunciosStore } from '../../../../src/hooks';
import { NuevasRedSocial } from '../../../../src/modules/banda/modals/NuevasRedSocial';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { noticia1 } from '../../../fixtures/anuncioFixtures';
import { NuevoAnuncio } from '../../../../src/modules/banda/modals/NuevoAnuncio';


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


jest.mock('../../../../src/hooks/useAnunciosStore');


describe('Pruebas en <NuevasRedSocial />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente', async() => {

        useAnunciosStore.mockReturnValue({
            errores: '',
            crearAnuncio: jest.fn().mockReturnValue( noticia1 ),
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <NuevoAnuncio open={true} handleClose={jest.fn()} setAnuncios={jest.fn()} setOpen={jest.fn()}/>
                    </MemoryRouter>
                </Provider>
            );
        });
    
        const boton = screen.getByLabelText('enviar');
        fireEvent.click( boton );
    });

});