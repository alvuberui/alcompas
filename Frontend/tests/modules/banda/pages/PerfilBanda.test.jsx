import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { PerfilBanda } from '../../../../src/modules/banda/pages/PerfilBanda';
import { useAuthStore, useBandasStore, useDirectivosStore, useComentariosStore, useAnunciosStore, useArchiverosStore, useRepertoriosStore, useLikesStore, useMusicosStore, useUploadsStore, useRedesSocialesStore } from '../../../../src/hooks';
import { authSlice } from '../../../../src/store/auth/authSlice';
import { authenticatedState2 } from '../../../fixtures/authFixtures';
import { banda1, banda2 } from '../../../fixtures/bandaFixtures';
import { directivo1 } from '../../../fixtures/directivoFixtures';
import { comentario1 } from '../../../fixtures/comentarioFixtures';
import { testUserCredentials2 } from '../../../fixtures/testUser';
import { musico1 } from '../../../fixtures/musicoFixtures';
import { redSocial1, redSocial10, redSocial2, redSocial3, redSocial4, redSocial5, redSocial6, redSocial7, redSocial8, redSocial9 } from '../../../fixtures/redSocialFixtures';
import { EditarFoto } from '../../../../src/modules/user';
import { likeFixtures } from '../../../fixtures/likeFixtures';
import { archivero1 } from '../../../fixtures/archiveroFixtures';
import { noticia1 } from '../../../fixtures/anuncioFixtures';
import { repertorio } from '../../../fixtures/repertorioFixtures';

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

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn().mockReturnValue({ bandaId: "63c850f1f4f9246bd4ecb661" }),
}));

jest.mock('../../../../src/hooks/useAuthStore');
jest.mock('../../../../src/hooks/useBandasStore');
jest.mock('../../../../src/hooks/useDirectivosStore');
jest.mock('../../../../src/hooks/useComentariosStore');
jest.mock('../../../../src/hooks/useMusicosStore');
jest.mock('../../../../src/hooks/useUploadsStore');
jest.mock('../../../../src/hooks/useRedesSocialesStore');
jest.mock('../../../../src/hooks/useLikesStore');
jest.mock('../../../../src/hooks/useAnunciosStore');
jest.mock('../../../../src/hooks/useRepertoriosStore');
jest.mock('../../../../src/hooks/useArchiverosStore');
jest.mock('../../../../src/modules/user');


describe('Pruebas en <PerfilBanda />', () => {

    beforeEach(() => jest.clearAllMocks() );

    test('debe de mostrar el componente correctamente', async() => {

        useAuthStore.mockReturnValue({
            user: testUserCredentials2,
            getUserByiD: jest.fn().mockReturnValue(testUserCredentials2),
        });

        useBandasStore.mockReturnValue({
            getBandaById: jest.fn().mockReturnValue(banda1),
        });

        useComentariosStore.mockReturnValue({
            getComentariosByBandaId: jest.fn().mockReturnValue([comentario1]),
        });

        useMusicosStore.mockReturnValue({
            getMusicosBanda: jest.fn().mockReturnValue({ 'Trompeta': [musico1]}),
            abandonarBandaMusico: jest.fn(),
            esMusicoByBandaId: jest.fn().mockReturnValue(true),
        });

        useUploadsStore.mockReturnValue({
            getFotoPerfilBanda: jest.fn(),
        });

        useDirectivosStore.mockReturnValue({
            getDirectivosByBandaId: jest.fn().mockReturnValue({'Presidente:': [directivo1]}),
            getDirectivoByUserId: jest.fn().mockReturnValue([directivo1]),
        });

        useRedesSocialesStore.mockReturnValue({
            getAllByBandaId: jest.fn().mockReturnValue([redSocial1, redSocial2, redSocial3, redSocial4, redSocial5, redSocial6, redSocial7, redSocial8, redSocial9, redSocial10]),
        });

        useLikesStore.mockReturnValue({
            publicarLike: jest.fn(),
            publicarDislike: jest.fn(),
            getLikeByTipoAndReferencia: jest.fn().mockReturnValue([likeFixtures]),
            getNumeroLikes: jest.fn().mockReturnValue(1),
            errores: [],
        });

        useArchiverosStore.mockReturnValue({
            esArchiveroByBandaId: jest.fn().mockReturnValue(true),
            getArchiverosByBandaId: jest.fn().mockReturnValue([archivero1]),
            finalizarArchivero: jest.fn(),
        });

        useAnunciosStore.mockReturnValue({
            getNoticiasByBanda: jest.fn().mockReturnValue([noticia1]),
        });

        useRepertoriosStore.mockReturnValue({
            getAllRepertoriosByBandaId: jest.fn().mockReturnValue([repertorio]),
        });


        await act(async() => {
            render(
                <Provider store={ store }>
                    <MemoryRouter>
                        <PerfilBanda />
                    </MemoryRouter>
                </Provider>
            );
        });
        await waitFor(() => {
            const boton =  screen.getByLabelText('contacto');
            expect( boton ).not.toBe( undefined);
            const like = screen.getByLabelText('like');
            fireEvent.click(like);
            const dislike = screen.getByLabelText('dislike');
            fireEvent.click(dislike);
            const abandonarmusico = screen.getByLabelText('abandonarmusico');
            fireEvent.click(abandonarmusico);
            const abandonararchivero = screen.getByLabelText('abandonararchivero');
            fireEvent.click(abandonararchivero);
            
        });

    
        
    });
});