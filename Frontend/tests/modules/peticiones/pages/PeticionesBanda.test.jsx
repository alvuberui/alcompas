import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { CrearPeticion } from '../../../../src/modules/peticiones/modals/CrearPeticion';
import { PeticionesBanda } from '../../../../src/modules/peticiones/pages/PeticionesBanda';
import { Peticion } from '../../../../src/Components';
import { useAuthStore, usePeticionesStore, useDirectivosStore } from '../../../../src/hooks';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { peticion1, peticion2 } from '../../../fixtures/peticionFixtures';
import { directivo1 } from '../../../fixtures/directivoFixtures';

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

jest.mock('../../../../src/hooks/useAuthStore');
jest.mock('../../../../src/hooks/usePeticionesStore');
jest.mock('../../../../src/hooks/useDirectivosStore');
jest.mock('../../../../src/modules/peticiones/modals/CrearPeticion');
jest.mock('../../../../src/Components/Peticion');

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn().mockReturnValue({ id: "63c850f1f4f9246bd4ecb661" }),
}));

describe('Pruebas en <PeticionesBanda />', () => {

    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: authenticatedState2.user
        });

        usePeticionesStore.mockReturnValue({
            getPeticionesByBandaId: jest.fn().mockReturnValue( [peticion1] ),
        });

        useDirectivosStore.mockReturnValue({
            getDirectivoByUserId: jest.fn().mockReturnValue( [directivo1] ),
        });


        await act(async () => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <PeticionesBanda />
                    </MemoryRouter>
                </Provider>
            );
        });
        
        const texto = screen.getByText('MIS PETICIONES');
        expect(texto).not.toBeNull(); 

    });

});