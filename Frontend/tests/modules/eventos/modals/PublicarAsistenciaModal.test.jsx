import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { useAsistenciasStore } from '../../../../src/hooks';
import { AñadirVestimenta } from '../../../../src/modules/banda/modals/AñadirVestimenta';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { banda1 } from '../../../fixtures/bandaFixtures';
import { vestimenta } from '../../../fixtures/vestimentaFixtures';
import {asistencia1} from '../../../fixtures/asistenciaFixtures';
import { PublicarAsistenciaModal } from '../../../../src/modules/eventos/modals/PublicarAsistenciaModal';
import { procesionFixture } from '../../../fixtures/eventoFixture';


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



jest.mock('../../../../src/hooks/useAsistenciasStore');


describe('Pruebas en <AñadirVestimenta />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente crear', async() => {

        useAsistenciasStore.mockReturnValue({
            actualizarAsistencia: jest.fn().mockReturnValue(asistencia1),
            crearAsistencia: jest.fn().mockReturnValue(asistencia1),
            errores: [],
            setErrores: jest.fn(),
            getAsistenciaByUsuarioEventoAndTipo: jest.fn().mockReturnValue(undefined),
        });

        act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <PublicarAsistenciaModal evento={procesionFixture} handleClose={jest.fn()} open={true} setOpen={jest.fn()} tipo={"Procesión"}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        
        const crear = screen.getByLabelText('crear');
        fireEvent.click(crear);
    });

    test('debe de mostrar el componente correctamente editar', async() => {

        useAsistenciasStore.mockReturnValue({
            actualizarAsistencia: jest.fn().mockReturnValue(asistencia1),
            crearAsistencia: jest.fn().mockReturnValue(asistencia1),
            errores: [],
            setErrores: jest.fn(),
            getAsistenciaByUsuarioEventoAndTipo: jest.fn().mockReturnValue(asistencia1),
        });

         act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <PublicarAsistenciaModal evento={procesionFixture} handleClose={jest.fn()} open={true} setOpen={jest.fn()} tipo={"Procesión"}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        
        await waitFor(() => {
            const crear = screen.getByLabelText('editar');
            fireEvent.click(crear);
        });
    });
});