import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, PersonalRegister, RegisterFrom, UpdateForm } from '../auth';
import { Dashboard  } from '../modules/dashboard/dashboard';
import { useAuthStore } from '../hooks';
import { Inicial } from '../invitado';
import { Perfil } from '../modules/user';
import { Peticiones } from '../modules/peticiones/pages/Peticiones';
import { PeticionesBanda } from '../modules/peticiones/pages/PeticionesBanda';
import { BandaForm, MisBandas, PerfilBanda } from '../modules/banda';
import { PanelDirectivo } from '../modules/banda/pages/PanelDirectivo';

export const AppRouter = () => {
  

    const { status, checkAuthToken } = useAuthStore();

    useEffect(() => {
      checkAuthToken()
    }, [])

    switch(status) {
      case 'autenticado':
          return (
            <Routes>
            
              <Route path="/" element={ <Dashboard/>} />
              <Route path="/*" element={ <Navigate to="/"/>} />
              <Route path="/perfil/:id/*" element={ <Perfil/>} />
              <Route path="/peticiones/:id/*" element={ <Peticiones/>} />
              <Route path="/peticiones/banda/:id/*" element={ <PeticionesBanda/>} />
              <Route path="/modificar/:id/*" element={ <UpdateForm/>} />
              <Route path="/bandas/crear/*" element={ <BandaForm/>} />
              <Route path="/bandas/:userId/*" element={ <MisBandas titulo='Mis Bandas'/>} />
              <Route path="/buscar/:nombre/*" element={ <MisBandas titulo='Buscar'/>} />
              <Route path="/banda/:bandaId" element={ <PerfilBanda/>} />
              <Route path="/banda/panel/:bandaId" element={ <PanelDirectivo/>} />
        
            </Routes>
          );
      case 'no-autenticado':
        return (
          <Routes>
              <Route path="/" element={ <Inicial/>} />,
              <Route path="/*" element={ <Navigate to="/"/>} />
              <Route path="/auth/login/*" element={ <LoginPage/>} />,
              <Route path="/auth/register/*" element={ <RegisterFrom/>} />
            
      
          </Routes>
        );
}
    
}