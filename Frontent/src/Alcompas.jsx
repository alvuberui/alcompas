import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from "./router";
import { AppTheme } from './Theme';


export const Alcompas = () => {
  return (
    <BrowserRouter>
      <AppTheme>
        <AppRouter />
      </AppTheme>
    </BrowserRouter>
  )
}
