import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { useRepertoriosStore } from '../../../../src/hooks';
import { AñadirVestimenta } from '../../../../src/modules/banda/modals/AñadirVestimenta';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { banda1 } from '../../../fixtures/bandaFixtures';
import { obra } from '../../../fixtures/obraFixtures';
import { NuevaObra } from '../../../../src/modules/banda/modals/NuevaObra';
import { repertorio } from '../../../fixtures/repertorioFixtures';
import { NuevoRepertorio } from '../../../../src/modules/banda/modals/NuevoRepertorio';


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


jest.mock('../../../../src/hooks/useRepertoriosStore');


describe('Pruebas en <NuevoRepertorio />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente crear', async() => {

        useRepertoriosStore.mockReturnValue({
            crearRepertorio: jest.fn().mockReturnValue(repertorio),
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <NuevoRepertorio handleClose={jest.fn()} open={true} setOpen={jest.fn()} setRepertorios={jest.fn()}></NuevoRepertorio>
                    </MemoryRouter>
                </Provider>
            );
        });
        

        const crear = screen.getByLabelText('enviar');
        fireEvent.click(crear);
    });
});