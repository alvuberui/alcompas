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
import { VerMotivo } from '../../../../src/modules/eventos/modals/VerMotivo';


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


describe('Pruebas en <VerMotivo />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente', async() => {

        act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <VerMotivo handleClose={jest.fn()} motivo={"Motivo ejemplo"} open={true}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        
        const motivo = screen.getByText('Motivo ejemplo');
        expect(motivo).not.toBeNull();
    });

    test('debe de mostrar el componente correctamente', async() => {

        act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <VerMotivo handleClose={jest.fn()} motivo={""} open={true}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        
        const motivo = screen.getByText('No hay comentario');
        expect(motivo).not.toBeNull();
        const cerrar = screen.getByLabelText('cerrar');
        fireEvent.click(cerrar);
    });
});