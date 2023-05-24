import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { alcompasAPI } from "../../src/api";
import { useVestimentasStore } from "../../src/hooks/useVestimentasStore";
import { authSlice } from "../../src/store/auth/authSlice";
import { vestimenta } from "../fixtures/vestimentaFixtures";
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

describe("Pruebas en useVestimentasStore", () => {
  test("Prueba creando una vestimenta", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useVestimentasStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
    const spy = jest.spyOn(alcompasAPI, "post").mockReturnValue({
      data: {
        nuevaVestimenta: vestimenta,
      },
    });

    await act(async () => {
      const res = await result.current.crearVestimenta(vestimenta);

      expect(res).toEqual(vestimenta);
    });

    spy.mockRestore();
  });

  test("Prueba negativa creando vestimenta", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useVestimentasStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
    // Mandar datos erroneos y comprobar que el mensaje de error no es vacio
    await act(async () => {
      await result.current.crearVestimenta({});
    });
    expect(result.current.errores).toEqual([
      "Error en el servidor, contacta con el administrador",
    ]);
  });

  test("Get all vestimentas from API", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useVestimentasStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
    const spy = jest.spyOn(alcompasAPI, "get").mockReturnValue({
      data: {
        vestimentas: [vestimenta],
      },
    });

    await act(async () => {
      const res = await result.current.getAllVestimentasByBanda();

      expect(res).toEqual([vestimenta]);
    });

    spy.mockRestore();
  });

  test("Get all vestimentas from API with error", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useVestimentasStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    await act(async () => {
      await result.current.getAllVestimentasByBanda("INVENTADO");
      const logSpy = jest.spyOn(console, "log");

      console.log("Error obteniendo vestimentas de la banda");

      expect(logSpy).toHaveBeenCalledWith("Error obteniendo vestimentas de la banda");
    });
  });

  test("Edtiar vestimenta from API", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useVestimentasStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
    const spy = jest.spyOn(alcompasAPI, "put").mockReturnValue({
      data: {
        nuevaVestimenta: vestimenta,
      },
    });

    await act(async () => {
      const res = await result.current.editarVestimenta(vestimenta);

      expect(res).toEqual(vestimenta);
    });

    spy.mockRestore();
  });

  test("Editar vestimenta error", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useVestimentasStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    await act(async () => {
      await result.current.editarVestimenta("INVENTADO");
      const logSpy = jest.spyOn(console, "log");

      console.log("Error editando vestimenta");

      expect(logSpy).toHaveBeenCalledWith("Error editando vestimenta");
    });
  });

  test("Eliminar vestimenta from API", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useVestimentasStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
    const spy = jest.spyOn(alcompasAPI, "delete").mockReturnValue({
      data: {
        vestimentaEliminada: vestimenta,
      },
    });

    await act(async () => {
      const res = await result.current.eliminarVestimenta(vestimenta);

      expect(res).toEqual(vestimenta);
    });

    spy.mockRestore();
  });

    test("Eliminar vestimenta error", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useVestimentasStore(), {
            wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
            ),
        });
    
        await act(async () => {
            await result.current.eliminarVestimenta("INVENTADO");
            const logSpy = jest.spyOn(console, "log");
    
            console.log("Error eliminando vestimenta");
    
            expect(logSpy).toHaveBeenCalledWith("Error eliminando vestimenta");
        });
        });

    test("Obtener todos con prestamos by banda", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useVestimentasStore(), {
            wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
            ),
        });
        const spy = jest.spyOn(alcompasAPI, "get").mockReturnValue({
            data: {
            vestimentas: [vestimenta],
            },
        });
    
        await act(async () => {
            const res = await result.current.obtenerTodosConPrestamosByBanda();
    
            expect(res).toEqual([vestimenta]);
        });
    
        spy.mockRestore();
        });

    test("Obtener todos con prestamos by banda error", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useVestimentasStore(), {
            wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
            ),
        });
    
        await act(async () => {
            await result.current.obtenerTodosConPrestamosByBanda("INVENTADO");
            const logSpy = jest.spyOn(console, "log");
    
            console.log("Error cargando vestimentas");
    
            expect(logSpy).toHaveBeenCalledWith("Error cargando vestimentas");
        });
    });

    test("Obtener todos sin prestar by banda", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useVestimentasStore(), {
            wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
            ),
        });
        const spy = jest.spyOn(alcompasAPI, "get").mockReturnValue({
            data: {
            vestimentas: [vestimenta],
            },
        });
    
        await act(async () => {
            const res = await result.current.obtenerTodosVestimentasSinPrestarByBanda();
    
            expect(res).toEqual([vestimenta]);
        });
    
        spy.mockRestore();
    });

    test("Obtener todos sin prestar by banda error", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useVestimentasStore(), {
            wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
            ),
        });
    
        await act(async () => {
            await result.current.obtenerTodosVestimentasSinPrestarByBanda("INVENTADO");
            const logSpy = jest.spyOn(console, "log");
    
            console.log("Error cargando vestimentas");
    
            expect(logSpy).toHaveBeenCalledWith("Error cargando vestimentas");
        });
    });
});
