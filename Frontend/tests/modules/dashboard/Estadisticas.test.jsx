import { configureStore } from "@reduxjs/toolkit";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { authSlice } from "../../../src/store/auth/authSlice";
import { noticia1 } from "../../fixtures/anuncioFixtures";
import { authenticatedState } from "../../fixtures/authFixtures";
import { useEstadisticasStore, useUploadsStore } from "../../../src/hooks";
import { Dashboard } from "../../../src/modules/dashboard/Dashboard";
import { banda1 } from "../../fixtures/bandaFixtures";
import { Estadisticas } from "../../../src/modules/dashboard/Estadisticas";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => (fn) => fn(),
}));

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
  preloadedState: {
    auth: authenticatedState,
  },
});

jest.mock("../../../src/hooks/useEstadisticasStore");
jest.mock("../../../src/hooks/useUploadsStore");

describe("Pruebas en <Estadisticas />", () => {
  beforeEach(() => jest.clearAllMocks());

  test("debe de mostrar el componente correctamente", async () => {
    useEstadisticasStore.mockReturnValue({
        getBandasConMasContratos: jest.fn().mockReturnValue([banda1]),
        getBandasConMasContratosSemanaSanta: jest.fn().mockReturnValue([banda1]),
        getBandasPopulares: jest.fn().mockReturnValue([banda1]),
    });

    useUploadsStore.mockReturnValue({
        getFotoPerfilBanda: jest.fn().mockReturnValue(""),
    });

    await act(async() => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Estadisticas />
          </MemoryRouter>
        </Provider>
      );
    });
     waitFor(() => {
      expect(screen.getByText("Estadísticas globales")).not.toBe(undefined);
      
    });

     waitFor(() => {
        const click1 = screen.getByLabelText("click1");
        click1.click();
    }  );
  });
});