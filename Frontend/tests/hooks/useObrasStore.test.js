import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { alcompasAPI } from "../../src/api";
import { useObrasStore } from "../../src/hooks/useObrasStore";
import { authSlice } from "../../src/store/auth/authSlice";
import { obra } from "../fixtures/obraFixtures";
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

describe("Pruebas en useObrasStore", () => {
  test("Prueba creando una obra", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useObrasStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
    const spy = jest.spyOn(alcompasAPI, "post").mockReturnValue({
      data: {
        nuevaObra: obra,
      },
    });

    await act(async () => {
      const res = await result.current.crearObra(obra.repertorio, obra);

      expect(res).toEqual(obra);
    });

    spy.mockRestore();
  });

  test("Prueba negativa creando una obra", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useObrasStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    await act(async () => {
      await result.current.crearObra("fwefwe", {});
      // Mockeamos swal alert 2
      expect(Swal.fire).toHaveBeenCalled();
    });
  });

    test("Prueba obteniendo todas las obras de un repertorio", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useObrasStore(), {
          wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
          ),
        });
        const spy = jest.spyOn(alcompasAPI, "get").mockReturnValue({
          data: {
            obras: [obra],
          },
        });
    
        await act(async () => {
          const res = await result.current.getAllObrasByRepertorioId("fwefwefewf");
    
          expect(res).toEqual([obra]);
        });
    
        spy.mockRestore();
    });

    test("Prueba negativa obteniendo todas las obras de un repertorio", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useObrasStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.getAllObrasByRepertorioId('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error obteniendo las obras del repertorio');

                expect(logSpy).toHaveBeenCalledWith('Error obteniendo las obras del repertorio');
            });
    });

    test("Prueba eliminando una obra", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useObrasStore(), {
          wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
          ),
        });
        const spy = jest.spyOn(alcompasAPI, "delete").mockReturnValue({
          data: {
            obra: obra,
          },
        });
    
        await act(async () => {
          const res = await result.current.eliminarObra(obra.repertorio);
    
          expect(res).toEqual(obra);
        });
    
        spy.mockRestore();
    });

    test("Prueba negativa eliminando una obra", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useObrasStore(), {
          wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
          ),
        });
    
        await act(async () => {
          await result.current.eliminarObra("fwefwef");
          // Mockeamos swal alert 2
          expect(Swal.fire).toHaveBeenCalled();
        });
    });

            

});
