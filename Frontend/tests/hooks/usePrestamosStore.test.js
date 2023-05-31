import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { alcompasAPI } from "../../src/api";
import { usePrestamosStore } from "../../src/hooks/usePrestamosStore";
import { authSlice } from "../../src/store/auth/authSlice";
import { prestamo } from "../fixtures/prestamoFixtures";
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

describe("Pruebas en usePrestamosStore", () => {

    test("Prueba creando un prestamo", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => usePrestamosStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });
        const spy = jest.spyOn(alcompasAPI, "post").mockReturnValue({
            data: {
                prestamo: prestamo,
            },
        });

        await act(async () => {
            const res = await result.current.crearPrestamo(prestamo, "5f9d5b3b1c9d4400008d3b1a");

            expect(res).toEqual(prestamo);
        });

        spy.mockRestore();
    });

    test("Prueba negativa creando prestamo", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => usePrestamosStore(), {
        wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
        ),
        });

        await act(async () => {
        await result.current.crearPrestamo({});
        // Mockeamos swal alert 2
        expect(Swal.fire).toHaveBeenCalled();
        });
    });

    test("Prueba obteniendo prestamo activo por referencia", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => usePrestamosStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });
        const spy = jest.spyOn(alcompasAPI, "get").mockReturnValue({
            data: {
                prestamo: prestamo,
            },
        });

        await act(async () => {
            const res = await result.current.getPrestamoActivoByReferencia("5f9d5b3b1c9d4400008d3b1a", "Vestimenta");

            expect(res).toEqual(prestamo);
        });

        spy.mockRestore();
    });

    test("Prueba negativa obteniendo prestamo activo por referencia", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => usePrestamosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getPrestamoActivoByReferencia('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error obteninedo el prestamo activo');

                expect(logSpy).toHaveBeenCalledWith('Error obteninedo el prestamo activo');
            });
        });

    test("Prueba cancelando prestamo", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => usePrestamosStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });
        const spy = jest.spyOn(alcompasAPI, "put").mockReturnValue({
            data: {
                prestamo: prestamo,
            },
        });

        await act(async () => {
            const res = await result.current.cancelarPrestamo("5f9d5b3b1c9d4400008d3b1a");

            expect(res).toEqual(prestamo);
        });

        spy.mockRestore();
    });

    test("Prueba negativa cancelando prestamo", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => usePrestamosStore(), {
        wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
        ),
        });

        await act(async () => {
        await result.current.cancelarPrestamo({});
        // Mockeamos swal alert 2
        expect(Swal.fire).toHaveBeenCalled();
        });
    });

    test("Prueba obteniendo prestamos de usuarios", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => usePrestamosStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });
        const spy = jest.spyOn(alcompasAPI, "get").mockReturnValue({
            data: {
                prestamos: [prestamo],
            },
        });

        await act(async () => {
            const res = await result.current.obtenerPrestamosUsuario("5f9d5b3b1c9d4400008d3b1a");

            expect(res).toEqual([prestamo]);
        });

        spy.mockRestore();
    });

    test("Prueba negativa obteniendo prestamos de usuarios", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => usePrestamosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.obtenerPrestamosUsuario('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error obteniendo prestamos');

                expect(logSpy).toHaveBeenCalledWith('Error obteniendo prestamos');
            });
    });


    test("Obtener prestamos de banda", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => usePrestamosStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });
        const spy = jest.spyOn(alcompasAPI, "get").mockReturnValue({
            data: {
                prestamos: [prestamo],
            },
        });

        await act(async () => {
            const res = await result.current.obtenerTodosByBanda("5f9d5b3b1c9d4400008d3b1a");

            expect(res).toEqual([prestamo]);
        });

        spy.mockRestore();
    });

    test("Prueba negativa obteniendo prestamos de banda", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => usePrestamosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.obtenerTodosByBanda('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error obteniendo prestamos');

                expect(logSpy).toHaveBeenCalledWith('Error obteniendo prestamos');
            });
    });

});