import { configureStore } from "@reduxjs/toolkit";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter, useParams } from "react-router-dom";
import { useAuthStore, useDirectivosStore } from "../../../../src/hooks";
import { Eventos } from "../../../../src/modules/eventos";
import { authSlice } from "../../../../src/store/auth/authSlice";
import {
  authenticatedState,
  authenticatedState2,
} from "../../../fixtures/authFixtures";
import { directivo1 } from "../../../fixtures/directivoFixtures";

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

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

jest.mock("../../../../src/hooks/useAuthStore");
jest.mock("../../../../src/hooks/useDirectivosStore");
jest.mock("../../../../src/hooks/useEventosStore");

describe("Pruebas en <Vestimentas />", () => {
  beforeEach(() => jest.clearAllMocks());

  test("debe de mostrar el componente correctamente", async () => {
    useAuthStore.mockReturnValue({
      user: authenticatedState2.user,
    });

    useParams.mockReturnValue({
      bandaId: "63c850f1f4f9246bd4ecb661",
    });

    useDirectivosStore.mockReturnValue({
      getDirectivoByUserId: jest.fn().mockReturnValue([directivo1]),
    });

     act( () => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <Eventos />
          </MemoryRouter>
        </Provider>
      );
    });
    waitFor (() => {
      expect(screen.getByText("Administración de Eventos")).toBeInTheDocument();
      const add = screen.getByLabelText("add");
      fireEvent.click(add);
    });
    
  });
});
