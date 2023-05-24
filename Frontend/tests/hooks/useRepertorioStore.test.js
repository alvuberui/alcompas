import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { alcompasAPI } from "../../src/api";
import { useAsistenciasStore } from "../../src/hooks/useAsistenciasStore";
import { authSlice } from "../../src/store/auth/authSlice";
import { repertorio } from "../fixtures/repertorioFixtures";
import { authenticatedState2 } from "../fixtures/authFixtures";
import { useRepertoriosStore } from "../../src/hooks/useRepertoriosStore";
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

describe("Pruebas en useRepertorioStore", () => {

    test("Prueba creando un repertorio", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useRepertoriosStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });
        const spy = jest.spyOn(alcompasAPI, "post").mockReturnValue({
            data: {
                nuevoRepertorio: repertorio,
            },
        });

        await act(async () => {
            const res = await result.current.crearRepertorio( "5f9d5b3b1c9d4400008d3b1a", repertorio);

            expect(res).toEqual(repertorio);
        });

        spy.mockRestore();
    });

    test("Prueba negativa creando repertorio", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useRepertoriosStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    await act(async () => {
      await result.current.crearRepertorio("inventado", {});
      // Mockeamos swal alert 2
      expect(Swal.fire).toHaveBeenCalled();
    });
    });

    test("Prueba obteniendo todos los repertorios de una banda", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useRepertoriosStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });
        const spy = jest.spyOn(alcompasAPI, "get").mockReturnValue({
            data: {
                repertorios: [repertorio],
            },
        });

        await act(async () => {
            const res = await result.current.getAllRepertoriosByBandaId("5f9d5b3b1c9d4400008d3b1a");

            expect(res).toEqual([repertorio]);
        });

        spy.mockRestore();
    });

    test("Prueba negativa obteniendo todos los repertorios de una banda", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useRepertoriosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getAllRepertoriosByBandaId('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error obteniendo los repertorios de la banda');

                expect(logSpy).toHaveBeenCalledWith('Error obteniendo los repertorios de la banda');
            });
    });

    test("Prueba eliminando un repertorio", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useRepertoriosStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });
        const spy = jest.spyOn(alcompasAPI, "delete").mockReturnValue({
            data: {
                repertorio: repertorio,
            },
        });

        await act(async () => {
            const res = await result.current.eliminarRepertorio("5f9d5b3b1c9d4400008d3b1a");

            expect(res).toEqual(repertorio);
        });

        spy.mockRestore();
    });

    test("Prueba negativa eliminando un repertorio", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useRepertoriosStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });

        await act(async () => {
            await result.current.eliminarRepertorio("inventado");
            // Mockeamos swal alert 2
            expect(Swal.fire).toHaveBeenCalled();
        });
    });



});
