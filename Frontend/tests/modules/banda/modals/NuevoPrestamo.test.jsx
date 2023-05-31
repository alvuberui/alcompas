import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { usePrestamosStore, useBandasStore } from '../../../../src/hooks';
import { NuevasRedSocial } from '../../../../src/modules/banda/modals/NuevasRedSocial';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { noticia1 } from '../../../fixtures/anuncioFixtures';
import { NuevoAnuncio } from '../../../../src/modules/banda/modals/NuevoAnuncio';
import { prestamo } from '../../../fixtures/prestamoFixtures';
import { directivo1 } from '../../../fixtures/directivoFixtures';
import { archivero1 } from '../../../fixtures/archiveroFixtures';
import { NuevoPrestamo } from '../../../../src/modules/banda/modals/NuevoPrestamo';
import { testUserCredentials } from '../../../fixtures/testUser';


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


jest.mock('../../../../src/hooks/usePrestamosStore');
jest.mock('../../../../src/hooks/useBandasStore');



describe('Pruebas en <NuevoPrestamo />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente', async() => {

        usePrestamosStore.mockReturnValue({
            crearPrestamo: jest.fn().mockReturnValue( noticia1 ),
        });

        useBandasStore.mockReturnValue({
            obtenerTodosCompontesBanda: jest.fn().mockReturnValue( [ testUserCredentials ] ),
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <NuevoPrestamo handleClose={jest.fn()} instrumentoId={"53ggfdgdfgdf"} open={true} setOpen={jest.fn()} setPrestamoIns={jest.fn()} vestimentaId={undefined}></NuevoPrestamo>
                    </MemoryRouter>
                </Provider>
            );
        });
    
        const boton = screen.getByLabelText('crear');
        fireEvent.click( boton );
    });

});