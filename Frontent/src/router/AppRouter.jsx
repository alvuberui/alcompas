import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../auth';
import { BandaPage } from '../banda';

export const AppRouter = () => {
  

    const authEstado = 'no-autenticado'
    return (
        <Routes>
            {
                (authEstado == 'no-autenticado')
                    ? <Route path="/auth/*" element={ <LoginPage/>} />
                    : <Route path="/*" element={ <BandaPage/>} />
            }

            <Route path="/*" element={ <Navigate to="/auth/login"/> } />
        </Routes>
  )
}
