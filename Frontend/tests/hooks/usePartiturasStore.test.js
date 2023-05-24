import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { alcompasAPI } from "../../src/api";
import { usePartiturasStore } from "../../src/hooks/usePartiturasStore";
import { obra } from "../fixtures/obraFixtures";
import { authSlice } from "../../src/store/auth/authSlice";
import { partitura } from "../fixtures/partituraFixtures";
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

describe("Pruebas en usePartiturasStore", () => {

    test("Prueba viendo mis partituras", async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => usePartiturasStore(), {
          wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
          ),
        });
        const spy = jest.spyOn(alcompasAPI, "get").mockReturnValue({
          data: {
            partituras: [partitura],
          },
        });
    
        await act(async () => {
          const res = await result.current.verMisParituras(obra._id);
    
          expect(res).toEqual([partitura]);
        });
    
        spy.mockRestore();
    });

    test("Prueba viendo mis partituras negativo", async () => {
      const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => usePartiturasStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.verMisParituras('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error obteniendo partituras');

                expect(logSpy).toHaveBeenCalledWith('Error obteniendo partituras');
            });
    });


    test("Eliminar partituras por id" , async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook(() => usePartiturasStore(), {
          wrapper: ({ children }) => (
            <Provider store={mockStore}>{children}</Provider>
          ),
        });
        const spy = jest.spyOn(alcompasAPI, "delete").mockReturnValue({
          data: {
            partitura: partitura,
          },
        });
    
        await act(async () => {
          const res = await result.current.eliminarPartitura(partitura._id);
    
          expect(res).toEqual(partitura);
        });
    
        spy.mockRestore();
      });


      test("Eliminar partituras por id negativo" , async () => {
        const mockStore = getMockStore({ ...authenticatedState2 });
        const { result } = renderHook( () => usePartiturasStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore } >{ children }</Provider>
        });
        
    
            await act(async() => {
                await result.current.eliminarPartitura('INVENTADO')
                const logSpy = jest.spyOn(console, 'log');

                console.log('Error eliminando partitura');

                expect(logSpy).toHaveBeenCalledWith('Error eliminando partitura');
            });
      });
});