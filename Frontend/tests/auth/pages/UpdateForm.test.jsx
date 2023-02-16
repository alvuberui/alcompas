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
            const usuario = screen.getByLabelText('usuariolabel');
            expect( usuario ).not.toBe( undefined);
            const otroBoton = screen.getByLabelText('siguiente');
            otroBoton.click();

        });

        await waitFor(() => {

            // Confirmation Register
            const nif = screen.getByLabelText('nif');
            expect( nif ).not.toBe( undefined);

            const retroceder1 = screen.getByLabelText('retroceder');
            retroceder1.click();

            const retroceder2 = screen.getByLabelText('retroceder');
            retroceder2.click();

            const retroceder3 = screen.getByLabelText('retroceder');
            retroceder3.click();
            
        });

        
    });  
    
    test('Debe mostrar error', async() => {
       
       
        mockGetUserById.mockReturnValue(user);

        useAuthStore.mockReturnValue({
            user: user,
            getUserByiD: mockGetUserById,
            startUpdate: jest.fn().mockReturnValue( [ ' '] )
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
            const usuario = screen.getByLabelText('usuariolabel');
            expect( usuario ).not.toBe( undefined);
            const otroBoton = screen.getByLabelText('siguiente');
            otroBoton.click();

        });

        await waitFor(() => {

            // Confirmation Register
            const nif = screen.getByLabelText('nif');
            expect( nif ).not.toBe( undefined);

            const confirmar = screen.getByLabelText('confirmar');
            confirmar.click();
        });

        
    });  
    
    test('Debe de enviar correcto', async() => {
       
       
        mockGetUserById.mockReturnValue(user);

        useAuthStore.mockReturnValue({
            user: user,
            getUserByiD: mockGetUserById,
            startUpdate: jest.fn().mockReturnValue( [ 'Correcto' ] )
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
            const nombreField = screen.getByLabelText("nombrelabel");
            fireEvent.change( nombreField, { target: { defaultValue: "Juan" } });

            const primerApellidoField = screen.getByLabelText("primerApellidolabel");
            fireEvent.change( primerApellidoField, { target: { defaultValue: "García" } });

            const segundoApellidoField = screen.getByLabelText("segundoApellidolabel");
            fireEvent.change( segundoApellidoField, { target: { defaultValue: "García" } });

            const dniField = screen.getByLabelText("dnilabel");
            fireEvent.change( dniField, { target: { defaultValue: "80681144L" } });

            const fechaNacimientoField = screen.getByLabelText("fechaNacimientolabel");
            fireEvent.change( fechaNacimientoField, { target: { defaultValue: "28/01/2000" } });

            const correoField = screen.getByLabelText("correolabel");
            fireEvent.change( correoField, { target: { defaultValue: "jgoierjgoer@gmail.com" } });

            const telefonoField = screen.getByLabelText("telefonolabel");
            fireEvent.change( telefonoField, { target: { defaultValue: "000000000" } });

            const btnSiguiente = screen.getByLabelText('link');
            expect( btnSiguiente ).not.toBe( undefined);
            btnSiguiente.click();
        });
        await waitFor(() => {
            const localidadField = screen.getByLabelText("localidadlabel");
            fireEvent.change( localidadField, { target: { defaultValue: "000000000" } });

            const provinciaField = screen.getByLabelText("provincialabel");
            fireEvent.change( provinciaField, { target: { defaultValue: "000000000" } });

            const postalField = screen.getByLabelText("codigoPostallabel");
            fireEvent.change( postalField, { target: { defaultValue: "000000000" } });

            const direccionField = screen.getByLabelText("Direccionlabel");
            fireEvent.change( direccionField, { target: { defaultValue: "000000000" } });

            // LocationRegister
            const direccionfield = screen.getByLabelText('Direccionlabel');
            fireEvent.change(direccionfield, { target: { defaultValue: 'Cambio' } });
            const direccion = screen.getByLabelText('direccion');
            expect( direccion ).not.toBe( undefined);
            const boton = screen.getByLabelText('link');
            boton.click();

        });

        await waitFor(() => {

            const usuarioField = screen.getByLabelText("usuariolabel");
            fireEvent.change( usuarioField, { target: { defaultValue: "juangarcia" } });

            const descripcionField = screen.getByLabelText("descripcionlabel");
            fireEvent.change( descripcionField, { target: { defaultValue: "Hola!" } });

            // UserRegister
            const usuario = screen.getByLabelText('usuariolabel');
            expect( usuario ).not.toBe( undefined);
            const otroBoton = screen.getByLabelText('siguiente');
            otroBoton.click();

        });

        await waitFor(() => {

            // Confirmation Register
            const nif = screen.getByLabelText('nif');
            expect( nif ).not.toBe( undefined);

            const confirmar = screen.getByLabelText('confirmar');
            confirmar.click();
        });

        
    });

    test('Debe mostrar error de algun campo incorrecto', async() => {
       
       
        mockGetUserById.mockReturnValue(user);

        useAuthStore.mockReturnValue({
            user: user,
            getUserByiD: mockGetUserById,
            startUpdate: jest.fn().mockReturnValue( [ 'Correcto' ] )
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
            const direccionfield = screen.getByLabelText('dnilabel');
            fireEvent.change(direccionfield, { target: { defaultValue: '255' } });

            const btnSiguiente = screen.getByLabelText('link');
            expect( btnSiguiente ).not.toBe( undefined);
            btnSiguiente.click();
        });
        await waitFor(() => {
            // LocationRegister
            const direccionfield = screen.getByLabelText('Direccionlabel');
            fireEvent.change(direccionfield, { target: { defaultValue: 'Cambio' } });
            const direccion = screen.getByLabelText('direccion');
            expect( direccion ).not.toBe( undefined);
            const boton = screen.getByLabelText('link');
            boton.click();

        });

        await waitFor(() => {

            // UserRegister
            const usuario = screen.getByLabelText('usuariolabel');
            expect( usuario ).not.toBe( undefined);
            const otroBoton = screen.getByLabelText('siguiente');
            otroBoton.click();

        });

        await waitFor(() => {

            // Confirmation Register
            const nif = screen.getByLabelText('nif');
            expect( nif ).not.toBe( undefined);

            const confirmar = screen.getByLabelText('confirmar');
            confirmar.click();
        });

        
    });
});