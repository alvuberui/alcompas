import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { Await, MemoryRouter } from 'react-router-dom';
import { RegisterFrom } from '../../../src/auth/pages/RegisterFrom';
import { authSlice } from '../../../src/store/auth/authSlice';
import { notAuthenticatedState } from '../../fixtures/authFixtures';


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
        auth: notAuthenticatedState
    }
})



describe('Pruebas en el  <RegisterFrom />', () => {

    beforeEach( () => 
        jest.clearAllMocks(),
        jest.setTimeout(60000)
        
    );

    

    test('Debe mostrar todos los registros correctamente', async() => {

        act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <RegisterFrom />
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
            
        });

        await waitFor(() => {

            // Confirmation Register
            const confirmar = screen.getByLabelText('confirmar');
            fireEvent.click(confirmar);
            
        });

        await act(async() => {
            // Confirmation Register
            const retroceder = screen.getByLabelText('retroceder');
            fireEvent.click(retroceder);
        });
        
        await act(async() => {
            const retroceder2 = screen.getByLabelText('retroceder');
            fireEvent.click(retroceder2);
        });

        await act(async() => {
            const retroceder3 = screen.getByLabelText('retroceder');
            fireEvent.click(retroceder3);
        });
    });
    
    test('Debe rellenar y enviar el registro', async() => {

        act(() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <RegisterFrom />
                    </MemoryRouter>
                </Provider>
            );
        });

        await act(async() => {
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
        await act(async() => {
            // LocationRegister
            const localidadField = screen.getByLabelText("localidadlabel");
            fireEvent.change( localidadField, { target: { defaultValue: "000000000" } });

            const provinciaField = screen.getByLabelText("provincialabel");
            fireEvent.change( provinciaField, { target: { defaultValue: "000000000" } });

            const postalField = screen.getByLabelText("codigoPostallabel");
            fireEvent.change( postalField, { target: { defaultValue: "000000000" } });

            const direccionField = screen.getByLabelText("Dirección");
            fireEvent.change( direccionField, { target: { defaultValue: "000000000" } });

            const boton = screen.getByLabelText('link');
            boton.click();
        });

        await waitFor(() => {
            const usuarioField = screen.getByLabelText("usuariolabel");
            fireEvent.change( usuarioField, { target: { defaultValue: "juangarcia" } });

            const contraseñaField = screen.getByLabelText("contraseñalabel");
            fireEvent.change( contraseñaField, { target: { defaultValue: "asdf1234" } });

            const confirmacionField = screen.getByLabelText("confirmacionlabel");
            fireEvent.change( confirmacionField, { target: { defaultValue: "asdf1234" } });

            const descripcionField = screen.getByLabelText("descripcionlabel");
            fireEvent.change( descripcionField, { target: { defaultValue: "Hola!" } });

            // UserRegister
            const otroBoton = screen.getByLabelText('siguiente');
            otroBoton.click();

        });

        await waitFor(() => {

            // Confirmation Register
            const confirmar = screen.getByLabelText('confirmar');
            fireEvent.click(confirmar);
            
        });
    });  
});