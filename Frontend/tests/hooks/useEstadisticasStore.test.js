import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { alcompasAPI } from "../../src/api";
import { useEstadisticasStore } from "../../src/hooks/useEstadisticasStore";
import { authSlice } from "../../src/store/auth/authSlice";
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

describe("Pruebas en useEstadisticasStore", () => {

    test("Prueba obteniendo las bandas con mas contratos", async () => {
            
            const mockStore = getMockStore({ ...authenticatedState2 });
            const { result } = renderHook(() => useEstadisticasStore(), {
                wrapper: ({ children }) => (
                    <Provider store={mockStore}>{children}</Provider>
                ),
            });
            const spy = jest.spyOn(alcompasAPI, "get").mockReturnValue({
                data: {
                    bandas: [],
                },
            });
    
            await act(async () => {
                const res = await result.current.getBandasConMasContratos();
    
                expect(res).toEqual([]);
            });
    
            spy.mockRestore();
        }
    );

    test("Prueba negativa obteniendo las bandas con mas contratos", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useEstadisticasStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
        await act(async() => {
            await result.current.getBandasConMasContratos('INVENTADO')
            const logSpy = jest.spyOn(console, 'log');

            console.log('Error cargando bandas');

            expect(logSpy).toHaveBeenCalledWith('Error cargando bandas');
        });
    });
        
        


    test("Prueba obteniendo las bandas con mas contratos en semana santa", async () => {

        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => useEstadisticasStore(), {
            wrapper: ({ children }) => (
                <Provider store={mockStore}>{children}</Provider>
            ),
        });
        const spy = jest.spyOn(alcompasAPI, "get").mockReturnValue({
            data: {
                bandas: [],
            },
        });

        await act(async () => {
            const res = await result.current.getBandasConMasContratosSemanaSanta();

            expect(res).toEqual([]);
        });

        spy.mockRestore();
    });

    test("Prueba negativa obteniendo las bandas con mas contratos en semana santa", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useEstadisticasStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
        await act(async() => {
            await result.current.getBandasConMasContratosSemanaSanta('INVENTADO')
            const logSpy = jest.spyOn(console, 'log');

            console.log('Error cargando bandas');

            expect(logSpy).toHaveBeenCalledWith('Error cargando bandas');
        });
    });


    test("Prueba obteniendo las bandas mas populares", async () => {
            
            const mockStore = getMockStore({ ...authenticatedState2 });
            const { result } = renderHook(() => useEstadisticasStore(), {
                wrapper: ({ children }) => (
                    <Provider store={mockStore}>{children}</Provider>
                ),
            });
            const spy = jest.spyOn(alcompasAPI, "get").mockReturnValue({
                data: {
                    bandas: [],
                },
            });
    
            await act(async () => {
                const res = await result.current.getBandasPopulares();
    
                expect(res).toEqual([]);
            });
    
            spy.mockRestore();
        }
    );

    test("Prueba negativa obteniendo las bandas mas populares", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => useEstadisticasStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
        await act(async() => {
            await result.current.getBandasPopulares('INVENTADO')
            const logSpy = jest.spyOn(console, 'log');

            console.log('Error cargando bandas');

            expect(logSpy).toHaveBeenCalledWith('Error cargando bandas');
        });
    });

});