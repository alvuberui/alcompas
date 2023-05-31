import { configureStore } from "@reduxjs/toolkit";
import { act, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { authSlice } from "../../../src/store/auth/authSlice";
import { noticia1 } from "../../fixtures/anuncioFixtures";
import { authenticatedState, authenticatedState2 } from "../../fixtures/authFixtures";
import { useAnunciosStore, useUploadsStore, useDirectivosStore, useBandasStore, useAuthStore } from "../../../src/hooks";
import { Dashboard } from "../../../src/modules/dashboard/Dashboard";
import { Noticia } from "../../../src/Components";
import { directivo1 } from "../../fixtures/directivoFixtures";
import { banda1 } from "../../fixtures/bandaFixtures";
import { Calendario } from "../../../src/Components/Calendario";

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

jest.mock("../../../src/hooks/useAnunciosStore");
jest.mock("../../../src/hooks/useUploadsStore");
jest.mock("../../../src/hooks/useDirectivosStore");
jest.mock("../../../src/hooks/useBandasStore");
jest.mock("../../../src/hooks/useAuthStore");
jest.mock("../../../src/Components/Calendario");

describe("Pruebas en <Dashboard />", () => {
  beforeEach(() => jest.clearAllMocks());

  test("debe de mostrar el componente correctamente", async () => {
    useAnunciosStore.mockReturnValue({
        getAllPublicas: jest.fn().mockReturnValue([noticia1]),
    });

    useUploadsStore.mockReturnValue({
        getFotoPerfilBanda: jest.fn().mockReturnValue({}),
    });

    useDirectivosStore.mockReturnValue({
      getDirectivoByUserId: jest.fn().mockReturnValue([directivo1]),
    });

    useBandasStore.mockReturnValue({
      getBandaById: jest.fn().mockReturnValue(banda1),
    });

    useAuthStore.mockReturnValue({
      user: authenticatedState2.user,
    });

    await act(async() => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );
    });
    waitFor(() => {
      expect(screen.getByText("Noticias Destacadas")).not.toBe(undefined);
    });
  });







  test("debe de mostrar el componente correctamente", async () => {
    useAnunciosStore.mockReturnValue({
      getAllPublicas: jest.fn().mockReturnValue([]),
    });

    act(() => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </Provider>
      );
    });
    await waitFor(() => {
      expect(screen.getByText("No hay noticias destacadas...")).not.toBe(
        undefined
      );
    });
  });
});
