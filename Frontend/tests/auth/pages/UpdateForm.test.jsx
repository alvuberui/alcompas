import { fireEvent, render, screen, act, waitFor } from '@testing-library/react';
import { UpdateForm } from '../../../src/auth/pages/UpdateForm';
import { useAuthStore } from '../../../src/hooks/useAuthStore';
import { useForm } from '../../../src/hooks';
import React from 'react';
import { AuthLayout } from '../../../src/auth/layout/AuthLayout';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from '../../../src/store/auth/authSlice';
import { authenticatedState } from '../../fixtures/authFixtures';


jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => (fn) => fn(),
}));

jest.mock("sweetalert2", () => ({
    fire: jest.fn(),
}));



const store = configureStore({
    reducer: {
        auth: authSlice.reducer
    },
    preloadedState: {
        auth: authenticatedState
    }
})

const user = {
    uid: 'abc',
    nombre: 'Fernando',
    primer_apellido: 'Perez',
    segundo_apellido: 'Garcia',
    correo: 'a@gmail.com',
    descripcion: 'descripcion',
    localidad: 'localidad',
    provincia: 'provincia',
    codigo_postal: '41400',
    direccion: 'direccion',
    nif: '15698705T',
    telefono: '666666666',
    usuario: 'usuario',
    contraseña: 'contraseña',
    fecha_nacimiento: new Date( '1990-01-01')
}


jest.mock('../../../src/hooks/useAuthStore');

describe('Pruebas en el  <UpdateForm />', () => {

    beforeEach(() => jest.clearAllMocks() );

    
    const mockGetUserById = jest.fn();
    
    test('debe de mostrar el componente de PersonalRegsiter correctamente', async() => {
       
       
        mockGetUserById.mockReturnValue(user);

        useAuthStore.mockReturnValue({
            user: user,
            getUserByiD: mockGetUserById,
        });
        
        act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        
                        <UpdateForm />
                    </MemoryRouter>
                </Provider>
            );
        });

        await waitFor(() => {
            // PersonalRegister
            const btnSiguiente = screen.getByLabelText('link');
            expect( btnSiguiente ).not.toBe( undefined);
            btnSiguiente.click();

            // LocationRegister
            const direccion = screen.getByLabelText('direccion');
            expect( direccion ).not.toBe( undefined);
            const boton = screen.getByLabelText('link');
            boton.click();

        });

        await waitFor(() => {

            // UserRegister
            const usuario = screen.getByLabelText('usuario');
            expect( usuario ).not.toBe( undefined);
            const otroBoton = screen.getByLabelText('siguiente');
            otroBoton.click();

        });

        await waitFor(() => {

            // Confirmation Register
            const nif = screen.getByLabelText('nif');
            expect( nif ).not.toBe( undefined);
            
        });

        
    });      
});