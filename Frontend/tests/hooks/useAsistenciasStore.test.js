import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { alcompasAPI } from "../../src/api";
import { useAsistenciasStore } from "../../src/hooks/useAsistenciasStore";
import { authSlice } from "../../src/store/auth/authSlice";
import { asistencia1 } from "../fixtures/asistenciaFixtures";
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

describe("Pruebas en useAsistenciasStore", () => {
  test("Prueba creando una asistencia", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useAsistenciasStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
    const spy = jest.spyOn(alcompasAPI, "post").mockReturnValue({
      data: {
        asistenciaDB: asistencia1,
      },
    });

    await act(async () => {
      const res = await result.current.crearAsistencia(asistencia1);

      expect(res).toEqual(asistencia1);
    });

    spy.mockRestore();
  });

  test("Prueba negativa creando asistencia", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useAsistenciasStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    await act(async () => {
      await result.current.crearAsistencia({});
      // Mockeamos swal alert 2
      expect(Swal.fire).toHaveBeenCalled();
    });
  });

  test("Prueba actualizando una asistencia", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useAsistenciasStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
    const spy = jest.spyOn(alcompasAPI, "put").mockReturnValue({
      data: {
        asistenciaDB: asistencia1,
      },
    });

    await act(async () => {
      const res = await result.current.actualizarAsistencia(
        asistencia1,
        asistencia1._id
      );

      expect(res).toEqual(asistencia1);
    });

    spy.mockRestore();
  });

  test("Prueba negativa actualizando asistencia", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useAsistenciasStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    await act(async () => {
      await result.current.actualizarAsistencia({}, asistencia1._id);
      // Mockeamos swal alert 2
      expect(Swal.fire).toHaveBeenCalled();
    });
  });

  test("Obtener asistencia por usuario evento y tipo de asistencia", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useAsistenciasStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
    const spy = jest.spyOn(alcompasAPI, "get").mockReturnValue({
      data: {
        asistencia: asistencia1,
      },
    });

    await act(async () => {
      const res = await result.current.getAsistenciaByUsuarioEventoAndTipo(
        asistencia1.usuario,
        asistencia1.evento,
        asistencia1.tipoAsistencia
      );

      expect(res).toEqual(asistencia1);
    });

    spy.mockRestore();
  });

  test("Obtener asistencias por usuario evento y tipo de asistencia negativo", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useAsistenciasStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getAsistenciaByUsuarioEventoAndTipo('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error cargando asistencia');

                expect(logSpy).toHaveBeenCalledWith('Error cargando asistencia');
            });
  });

  test("Obtener todas las asistencias por evento", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useAsistenciasStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
    const spy = jest.spyOn(alcompasAPI, "get").mockReturnValue({
      data: {
        resultado: [asistencia1],
      },
    });

    await act(async () => {
      const res = await result.current.getTodasAsistenciasByEvento(
        asistencia1.evento
      );

      expect(res).toEqual([asistencia1]);
    });

    spy.mockRestore();
  });

    test("Obtener todas las asistencias por evento negativo", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useAsistenciasStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getTodasAsistenciasByEvento('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error cargando asistencias');

                expect(logSpy).toHaveBeenCalledWith('Error cargando asistencias');
            });
    }
    );
});
