import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { useTransaccionesStore } from '../../../../src/hooks';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { banda1 } from '../../../fixtures/bandaFixtures';
import { obra } from '../../../fixtures/obraFixtures';
import { NuevaObra } from '../../../../src/modules/banda/modals/NuevaObra';
import { repertorio } from '../../../fixtures/repertorioFixtures';
import { partitura } from '../../../fixtures/partituraFixtures';
import { NuevaPartitura } from '../../../../src/modules/banda/modals/NuevaPartitura';
import { transaccion, transaccion2 } from '../../../fixtures/transaccionFixtures';
import { NuevoTransaccion } from '../../../../src/modules/banda/modals/NuevaTransaccion';


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


jest.mock('../../../../src/hooks/useTransaccionesStore');


describe('Pruebas en <NuevaTransaccion />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente crear', async() => {

        useTransaccionesStore.mockReturnValue({
            crearTransaccion: jest.fn().mockReturnValue(transaccion),
            errores: [],
            getByBanda: jest.fn().mockReturnValue(transaccion),
            actualizarTransaccion: jest.fn().mockReturnValue(transaccion),
            getTransaccionesUltimoAño: jest.fn().mockReturnValue([transaccion]),
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <NuevoTransaccion editar={undefined} open={true} setTotal={jest.fn()} setTransacciones={jest.fn()}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        

        const crear = screen.getByLabelText('enviar');
        fireEvent.click(crear);
    });

    test('debe de mostrar el componente correctamente editar', async() => {

        useTransaccionesStore.mockReturnValue({
            crearTransaccion: jest.fn().mockReturnValue(transaccion),
            errores: [],
            getByBanda: jest.fn().mockReturnValue(transaccion),
            actualizarTransaccion: jest.fn().mockReturnValue(transaccion),
            getTransaccionesUltimoAño: jest.fn().mockReturnValue([transaccion]),
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <NuevoTransaccion editar={true} setOpenEditar={jest.fn()} setOpen={jest.fn()} handleClose={jest.fn()} open={true} setTotal={jest.fn()} setTransacciones={jest.fn()} transaccion={transaccion}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        await act(async() => {
            const crear = screen.getByLabelText('enviar');
            fireEvent.click(crear);
        });

        
    });

    test('debe de mostrar el componente correctamente editar incorrecto', async() => {

        useTransaccionesStore.mockReturnValue({
            crearTransaccion: jest.fn().mockReturnValue(transaccion),
            errores: [],
            getByBanda: jest.fn().mockReturnValue(transaccion),
            actualizarTransaccion: jest.fn().mockReturnValue(transaccion),
            getTransaccionesUltimoAño: jest.fn().mockReturnValue([transaccion]),
        });

        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <NuevoTransaccion editar={true} setOpenEditar={jest.fn()} setOpen={jest.fn()} handleClose={jest.fn()} open={true} setTotal={jest.fn()} setTransacciones={jest.fn()} transaccion={transaccion2}/>
                    </MemoryRouter>
                </Provider>
            );
        });
        await act(async() => {
            const crear = screen.getByLabelText('enviar');
            fireEvent.click(crear);
        });

        
    });
});