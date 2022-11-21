import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from "./router";
import { AppTheme } from './Theme';
import { store } from './store/store';
import { Provider } from 'react-redux';

export const Alcompas = () => {
  return (
    <Provider store={ store }>
      <BrowserRouter>
        <AppTheme>
          <AppRouter />
        </AppTheme>
      </BrowserRouter>
    </Provider>
  )
}
