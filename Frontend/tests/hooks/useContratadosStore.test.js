import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { alcompasAPI } from "../../src/api";
import { useContratadosStore } from "../../src/hooks/useContratadosStore";
import { authSlice } from "../../src/store/auth/authSlice";
import { contratadoFixture } from "../fixtures/contratadoFixture";
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

describe("Pruebas en useContratadosStore", () => {

    test("Prueba creando un contratado", async () => {

        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useContratadosStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });
        const spy = jest.spyOn(alcompasAPI, "post").mockReturnValue({
            data: {
                contratadoDB: contratadoFixture,
            },
        });

        await act(async () => {
            const res = await result.current.crearContratados(contratadoFixture);

            expect(res).toEqual(contratadoFixture);
        });

        spy.mockRestore();
    });


    test("Prueba negativa creando contratado", async () => {
            
            const mockStore = getMockStore({ ...authenticatedState2 });
            const { result } = renderHook(() => useContratadosStore(), {
                wrapper: ({ children }) => (
                    <Provider store={mockStore}>{children}</Provider>
                ),
            });
            await act(async () => {
                await result.current.crearContratados({});
                // Mockeamos swal alert 2
                expect(Swal.fire).toHaveBeenCalled();
              });
        }
    );

    test("Prueba obteniendo contratados por evento", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useContratadosStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });
        const spy = jest.spyOn(alcompasAPI, "get").mockReturnValue({
            data: {
                resultados: [contratadoFixture],
            },
        });

        await act(async () => {
            const res = await result.current.getContratadosByEnveto(
                "evento",
                "123"
            );

            expect(res).toEqual([contratadoFixture]);
        });

        spy.mockRestore();
    });

    test("Prueba obteniendo contratados por evento negativo", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useContratadosStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });
       

        await act(async () => {
            await result.current.getContratadosByEnveto("evento", "123");
            

        });
        // comprobar quer errores tiene un valor
        expect(result.current.errores.length).toBeGreaterThan(0);
    });

    test("Prueba eliminando contratado", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useContratadosStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });
        const spy = jest.spyOn(alcompasAPI, "delete").mockReturnValue({
            data: {
                eliminado: contratadoFixture,
            },
        });

        await act(async () => {
            const res = await result.current.deleteContratado("123");

            expect(res).toEqual(contratadoFixture);
        });

        spy.mockRestore();
    });

    test("Prueba eliminando contratado negativo", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useContratadosStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });
        

        await act(async () => {
            await result.current.deleteContratado("123");
        });
        // comprobar quer errores tiene un valor
        expect(result.current.errores.length).toBeGreaterThan(0);
    });

});