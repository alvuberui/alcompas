import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { usePartiturasStore } from '../../../../src/hooks';
import { AñadirVestimenta } from '../../../../src/modules/banda/modals/AñadirVestimenta';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { banda1 } from '../../../fixtures/bandaFixtures';
import { obra } from '../../../fixtures/obraFixtures';
import { NuevaObra } from '../../../../src/modules/banda/modals/NuevaObra';
import { repertorio } from '../../../fixtures/repertorioFixtures';
import { partitura } from '../../../fixtures/partituraFixtures';
import { NuevaPartitura } from '../../../../src/modules/banda/modals/NuevaPartitura';


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


jest.mock('../../../../src/hooks/usePartiturasStore');


describe('Pruebas en <NuevaObra />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente crear', async() => {

        usePartiturasStore.mockReturnValue({
            crearPartitura: jest.fn().mockReturnValue(partitura),
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <NuevaPartitura handleClose={jest.fn()} obra={obra} open={true} setPartituras={jest.fn()} />
                    </MemoryRouter>
                </Provider>
            );
        });
        

        const crear = screen.getByLabelText('enviar');
        fireEvent.click(crear);
    });
});