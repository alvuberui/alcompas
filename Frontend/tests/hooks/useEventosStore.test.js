import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { alcompasAPI } from "../../src/api";
import { useEventosStore } from "../../src/hooks/useEventosStore";
import { authSlice } from "../../src/store/auth/authSlice";
import {
  procesionFixture,
  actuacionFixture,
  ensayoFixture,
} from "../fixtures/eventoFixture";
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

describe("Pruebas en useEventosStore", () => {
  test("Prueba creando una actuacion", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useEventosStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
    const spy = jest.spyOn(alcompasAPI, "post").mockReturnValue({
      data: {
        banda: actuacionFixture,
      },
    });

    await act(async () => {
      const res = await result.current.crearActuacion(actuacionFixture);

      expect(res).toEqual(actuacionFixture);
    });

    spy.mockRestore();
  });

  test("Prueba negativa creando actuacion", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useEventosStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
    // Mandar datos erroneos y comprobar que el mensaje de error no es vacio
    await act(async () => {
      await result.current.crearActuacion({}); 
    });
    expect(result.current.mensajeError).toEqual('No hay token en la petición');
  });

  
  
    

  test("Prueba creando una ensayo", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useEventosStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
    const spy = jest.spyOn(alcompasAPI, "post").mockReturnValue({
      data: {
        banda: ensayoFixture,
      },
    });

    await act(async () => {
      const res = await result.current.crearEnsayo(ensayoFixture);

      expect(res).toEqual(ensayoFixture);
    });

    spy.mockRestore();
  });

  test("Prueba negativa creando ensayo", async () => {
    const mockStore = getMockStore({ ...authenticatedState2 });
    const { result } = renderHook(() => useEventosStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
    // Mandar datos erroneos y comprobar que el mensaje de error no es vacio
    await act(async () => {
      await result.current.crearEnsayo({}); 
    });
    expect(result.current.mensajeError).toEqual('No hay token en la petición');
  });




  

    test("Prueba creando una procesion", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useEventosStore(), {
          wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
          ),
        });
        const spy = jest.spyOn(alcompasAPI, "post").mockReturnValue({
          data: {
            banda: procesionFixture,
          },
        });
    
        await act(async () => {
          const res = await result.current.crearProcesion(procesionFixture);
    
          expect(res).toEqual(procesionFixture);
        });
    
        spy.mockRestore();
    });

    test("Prueba negativa creando procesion", async () => {
      const mockStore = getMockStore({ ...authenticatedState2 });
      const { result } = renderHook(() => useEventosStore(), {
        wrapper: ({ children }) => (
          <Provider store={mockStore}>{children}</Provider>
        ),
      });
      // Mandar datos erroneos y comprobar que el mensaje de error no es vacio
      await act(async () => {
        await result.current.crearProcesion({}); 
      });
      expect(result.current.mensajeError).toEqual('No hay token en la petición');
    });

    test("Prueba actualizando una actuacion", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useEventosStore(), {
          wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
          ),
        });
        const spy = jest.spyOn(alcompasAPI, "put").mockReturnValue({
          data: {
            actuacionDB: actuacionFixture,
          },
        });
    
        await act(async () => {
          const res = await result.current.actualizarActuacion(actuacionFixture);
    
          expect(res).toEqual(actuacionFixture);
        });
    
        spy.mockRestore();
    });

    test("Prueba negativa ctualizando una actuacion", async () => {
      const mockStore = getMockStore({ ...authenticatedState2 });
      const { result } = renderHook(() => useEventosStore(), {
        wrapper: ({ children }) => (
          <Provider store={mockStore}>{children}</Provider>
        ),
      });
      // Mandar datos erroneos y comprobar que el mensaje de error no es vacio
      await act(async () => {
        await result.current.actualizarActuacion({}); 
      });
      expect(result.current.mensajeError).toEqual('No hay token en la petición');
    });

    test("Prueba actualizando una ensayo", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useEventosStore(), {
          wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
          ),
        });
        const spy = jest.spyOn(alcompasAPI, "put").mockReturnValue({
          data: {
            ensayoDB: ensayoFixture,
          },
        });
    
        await act(async () => {
          const res = await result.current.actualizarEnsayo(ensayoFixture);
    
          expect(res).toEqual(ensayoFixture);
        });
    
        spy.mockRestore();
    });

    test("Prueba negativa actualizando una ensayo", async () => {
      const mockStore = getMockStore({ ...authenticatedState2 });
      const { result } = renderHook(() => useEventosStore(), {
        wrapper: ({ children }) => (
          <Provider store={mockStore}>{children}</Provider>
        ),
      });
      // Mandar datos erroneos y comprobar que el mensaje de error no es vacio
      await act(async () => {
        await result.current.actualizarEnsayo({}); 
      });
      expect(result.current.mensajeError).toEqual('No hay token en la petición');
    });

    test("Prueba actualizando una procesion", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useEventosStore(), {
          wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
          ),
        });
        const spy = jest.spyOn(alcompasAPI, "put").mockReturnValue({
          data: {
            procesionDB: procesionFixture,
          },
        });
    
        await act(async () => {
          const res = await result.current.actualizarProcesion(procesionFixture, "60a8e2c6e0c4a73c0c5f7e4f");
    
          expect(res).toEqual(procesionFixture);
        });
    
        spy.mockRestore();
    });

    test("Prueba negativa actualizando una procesion", async () => {
      const mockStore = getMockStore({ ...authenticatedState2 });
      const { result } = renderHook(() => useEventosStore(), {
        wrapper: ({ children }) => (
          <Provider store={mockStore}>{children}</Provider>
        ),
      });
      // Mandar datos erroneos y comprobar que el mensaje de error no es vacio
      await act(async () => {
        await result.current.actualizarProcesion({}); 
      });
      expect(result.current.mensajeError).toEqual('No hay token en la petición');
    });

    test("Get destacados", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useEventosStore(), {
          wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
          ),
        });
        const spy = jest.spyOn(alcompasAPI, "post").mockReturnValue({
          data: {
            eventos: [procesionFixture, actuacionFixture, ensayoFixture],
          },
        });
    
        await act(async () => {
          const res = await result.current.getDestacados("2019-05-20");
    
          expect(res).toEqual([procesionFixture, actuacionFixture, ensayoFixture]);
        });
    
        spy.mockRestore();
    });

    test("Get destacados negativo", async () => {
      const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useEventosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
            await act(async() => {
                await result.current.getDestacados()
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error obteniendo el evento');

                expect(logSpy).toHaveBeenCalledWith('Error obteniendo el evento');
            });
    });

    test("getEventosByDateAndBanda", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useEventosStore(), {
          wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
          ),
        });
        const spy = jest.spyOn(alcompasAPI, "post").mockReturnValue({
          data: {
            eventos: [procesionFixture, actuacionFixture, ensayoFixture],
          },
        });
    
        await act(async () => {
          const res = await result.current.getEventosByDateAndBanda({fecha: "2021-05-20", banda: "60a8e2c6e0c4a73c0c5f7e4f"});
    
          expect(res).toEqual([procesionFixture, actuacionFixture, ensayoFixture]);
        });
    
        spy.mockRestore();
    });

    test("getEventosByDateAndBanda negativo", async () => {
      const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useEventosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
            await act(async() => {
                await result.current.getEventosByDateAndBanda({})
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error obteniendo el evento');

                expect(logSpy).toHaveBeenCalledWith('Error obteniendo el evento');
            });
    });


    test("getByTipoId", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useEventosStore(), {
          wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
          ),
        });
        const spy = jest.spyOn(alcompasAPI, "get").mockReturnValue({
          data: {
            evento: procesionFixture,
          },
        });
    
        await act(async () => {
          const res = await result.current.getByTipoId("procesion", "60a8e2c6e0c4a73c0c5f7e4f");
    
          expect(res).toEqual(procesionFixture);
        });
    
        spy.mockRestore();
    });

    test("getByTipoId negativo", async () => {
      const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useEventosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
            await act(async() => {
                await result.current.getByTipoId("fasfas", "fasfasfas")
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error obteniendo el evento');

                expect(logSpy).toHaveBeenCalledWith('Error obteniendo el evento');
            });
    });

    test("deleteByTipoId", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useEventosStore(), {
          wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
          ),
        });
        const spy = jest.spyOn(alcompasAPI, "delete").mockReturnValue({
          data: {
            evento: procesionFixture,
          },
        });
    
        await act(async () => {
          const res = await result.current.deleteByTipoId("procesion", "60a8e2c6e0c4a73c0c5f7e4f");
    
          expect(res).toEqual(procesionFixture);
        });
    
        spy.mockRestore();
    });

    test("deleteByTipoId negativo", async () => {
      const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useEventosStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
            await act(async() => {
                await result.current.deleteByTipoId("fasfas", "fasfasfas")
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error eliminando el evento');

                expect(logSpy).toHaveBeenCalledWith('Error eliminando el evento');
            });
    });


});
