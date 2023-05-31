import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { useVestimentasStore } from '../../../../src/hooks';
import { AñadirVestimenta } from '../../../../src/modules/banda/modals/AñadirVestimenta';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { banda1 } from '../../../fixtures/bandaFixtures';
import { vestimenta } from '../../../fixtures/vestimentaFixtures';


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


jest.mock('../../../../src/hooks/useVestimentasStore');


describe('Pruebas en <AñadirVestimenta />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente crear', async() => {

        useVestimentasStore.mockReturnValue({
            crearVestimenta: jest.fn().mockReturnValue(vestimenta),
            editarVestimenta: jest.fn(),
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <AñadirVestimenta banda={banda1} editar={undefined} handleClose={jest.fn()} open={true} setOpen={jest.fn()} setVestimentas={jest.fn()}  />
                    </MemoryRouter>
                </Provider>
            );
        });
        
        const crear = screen.getByLabelText('crear');
        fireEvent.click(crear);
    });

    test('debe de mostrar el componente correctamente editar', async() => {

        useVestimentasStore.mockReturnValue({
            crearVestimenta: jest.fn().mockReturnValue(vestimenta),
            editarVestimenta: jest.fn().mockReturnValue(vestimenta),
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <AñadirVestimenta banda={banda1} editar={true} handleClose={jest.fn()} open={true} setOpen={jest.fn()} setVestimentas={jest.fn()}  vestimentaAntigua={vestimenta}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        
        const crear = screen.getByLabelText('editar');
        fireEvent.click(crear);
    });

    
});