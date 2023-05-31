import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { alcompasAPI } from "../../src/api";
import { useLikesStore } from "../../src/hooks/useLikesStore";
import { authSlice } from "../../src/store/auth/authSlice";
import { likeFixtures } from "../fixtures/likeFixtures";
import { authenticatedState2 } from "../fixtures/authFixtures";
const Swal = require("sweetalert2");

const getMockStore = (initialState) => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
    },
    preloadedState: {
      auth: { ...initialState },
    },
  });
};

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

describe("Pruebas en useLikesStore", () => {

    test("Prueba publicando un like", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useLikesStore(), {
        wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
        ),
        });
        const spy = jest.spyOn(alcompasAPI, "post").mockReturnValue({
        data: {
            likeDB: likeFixtures,
        },
        });

        await act(async () => {
        const res = await result.current.publicarLike(likeFixtures);

        expect(res).toEqual(likeFixtures);
        });

        spy.mockRestore();
    });

    test("Prueba negativa publicando un like", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useLikesStore(), {
        wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
        ),
        });
        // Mandar datos erroneos y comprobar que el mensaje de error no es vacio
        await act(async () => {
        await result.current.publicarLike({}); 
        });
        expect(result.current.errores).toEqual('No se pudo completar el like');
    });

    test("Prueba publicando un dislike", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useLikesStore(), {
        wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
        ),
        });
        const spy = jest.spyOn(alcompasAPI, "delete").mockReturnValue({
        data: {
            likeDB: likeFixtures,
        },
        });

        await act(async () => {
        const res = await result.current.publicarDislike(likeFixtures);

        expect(res).toEqual(likeFixtures);
        });

        spy.mockRestore();
    });

    test("Prueba negativa publicando un dislike", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useLikesStore(), {
        wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
        ),
        });
        // Mandar datos erroneos y comprobar que el mensaje de error no es vacio
        await act(async () => {
        await result.current.publicarDislike({}); 
        });
        expect(result.current.errores).toEqual('No se pudo completar el dislike');
    });

    test("Prueba obteniendo un like por tipo y referencia", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useLikesStore(), {
        wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
        ),
        });
        const spy = jest.spyOn(alcompasAPI, "get").mockReturnValue({
        data: {
            like: likeFixtures,
        },
        });

        await act(async () => {
        const res = await result.current.getLikeByTipoAndReferencia(likeFixtures);

        expect(res).toEqual(likeFixtures);
        });

        spy.mockRestore();
    });

    test("Prueba obteniendo un numero de likes por tipo y referencia", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useLikesStore(), {
        wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
        ),
        });
        const spy = jest.spyOn(alcompasAPI, "get").mockReturnValue({
        data: {
            likes: 1,
        },
        });

        await act(async () => {
        const res = await result.current.getNumeroLikes(likeFixtures);

        expect(res).toEqual(1);
        });

        spy.mockRestore();
    });
});
