import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { alcompasAPI } from "../../src/api";
import { useTransaccionesStore } from "../../src/hooks/useTransaccionesStore";
import { authSlice } from "../../src/store/auth/authSlice";
import { transaccion } from "../fixtures/transaccionFixtures";
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

describe("Pruebas en useTransaccionesStore", () => {
  test("Prueba creando una transaccion", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useTransaccionesStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
    const spy = jest.spyOn(alcompasAPI, "post").mockReturnValue({
      data: {
        transaccionDB: transaccion,
      },
    });

    await act(async () => {
      const res = await result.current.crearTransaccion(transaccion);

      expect(res).toEqual(transaccion);
    });

    spy.mockRestore();
  });

  test("Prueba negativa creando transaccion", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useTransaccionesStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
    // Mandar datos erroneos y comprobar que el mensaje de error no es vacio
    await act(async () => {
      await result.current.crearTransaccion({});
    });
    expect(result.current.errores).toEqual("No tienes acceso a esta operación");
  });

  test("Prueba actualizando transaccion", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useTransaccionesStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
    const spy = jest.spyOn(alcompasAPI, "put").mockReturnValue({
      data: {
        transaccionDB: transaccion,
      },
    });

    await act(async () => {
      const res = await result.current.actualizarTransaccion(
        transaccion,
        transaccion._id
      );

      expect(res).toEqual(transaccion);
    });

    spy.mockRestore();
  });

  test("Prueba negativa actualizando transaccion", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useTransaccionesStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
    // Mandar datos erroneos y comprobar que el mensaje de error no es vacio
    await act(async () => {
      await result.current.actualizarTransaccion({});
    });
    expect(result.current.errores).toEqual("No tienes acceso a esta operación");
  });

  test("Obtener by banda", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useTransaccionesStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
    const spy = jest.spyOn(alcompasAPI, "get").mockReturnValue({
      data: {
        transacciones: [transaccion],
      },
    });

    await act(async () => {
      const res = await result.current.getByBanda(transaccion._id);

      expect(res).toEqual([transaccion]);
    });

    spy.mockRestore();
  });

  test("Obtener by banda negativo", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useTransaccionesStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
    // Mandar datos erroneos y comprobar que el mensaje de error no es vacio
    await act(async () => {
      await result.current.getByBanda("ffsdfsdfsd");
    });
    expect(result.current.errores).toEqual("No tienes acceso a esta operación");
  });

  test("Obtener utlimo año", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useTransaccionesStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
    const spy = jest.spyOn(alcompasAPI, "get").mockReturnValue({
      data: {
        transacciones: [transaccion],
      },
    });

    await act(async () => {
      const res = await result.current.getTransaccionesUltimoAño(
        "60b9b0b9e6b3c2a7b8e0b0b9"
      );

      expect(res).toEqual([transaccion]);
    });

    spy.mockRestore();
  });

  test("Obtener utlimo año negativo", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useTransaccionesStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
    // Mandar datos erroneos y comprobar que el mensaje de error no es vacio
    await act(async () => {
      await result.current.getTransaccionesUltimoAño("ffsdfsdfsd");
    });
    expect(result.current.errores).toEqual("No tienes acceso a esta operación");
  });

  test("Eliminar transaccion", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useTransaccionesStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
    const spy = jest.spyOn(alcompasAPI, "delete").mockReturnValue({
      data: {
        transaccionDB: transaccion,
      },
    });

    await act(async () => {
      const res = await result.current.deleteById(transaccion._id);

      expect(res).toEqual(transaccion);
    });

    spy.mockRestore();
  });

    test("Eliminar transaccion negativo", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useTransaccionesStore(), {
            wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
            ),
        });
        // Mandar datos erroneos y comprobar que el mensaje de error no es vacio
        await act(async () => {
            await result.current.deleteById("ffsdfsdfsd");
        });
        expect(result.current.errores).toEqual("No tienes acceso a esta operación");
        }
    );
});
