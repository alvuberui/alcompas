import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NavBar, NavbarInvitado } from '../Components';
import { LoginPage, RegisterFrom, UpdateForm } from '../auth';
import { useAuthStore } from '../hooks';
import { Inicial } from '../invitado';
import { AdministrarBandas, AdministrarUsuarios, Menu } from '../modules/admin';
import { Anuncios, BandaForm, Instrumentos, MisBandas, PerfilBanda, PrestamosBanda, RedesSociales, Transacciones, UpdateBandaForm, Vestimentas } from '../modules/banda';
import { PanelDirectivo } from '../modules/banda/pages/PanelDirectivo';
import { Dashboard } from '../modules/dashboard/Dashboard';
import { Estadisticas } from '../modules/dashboard/Estadisticas';
import { ActualizarEventoForm, CrearEventoForm, Eventos } from '../modules/eventos';
import { AsistenciaEvento } from '../modules/eventos/pages/AsistenciaEvento';
import { ContratarMusico } from '../modules/eventos/pages/ContratarMusico';
import { Peticiones } from '../modules/peticiones/pages/Peticiones';
import { PeticionesBanda } from '../modules/peticiones/pages/PeticionesBanda';
import { Perfil, Prestamos } from '../modules/user';

export const AppRouter = () => {
  

    const { status, checkAuthToken } = useAuthStore();
    const [ isLogged, setIsLogged ] = useState(status);

    useEffect(() => {
      checkAuthToken()
    }, [])

    useEffect(() => {
      setIsLogged(status);
    }, [status])

    switch(isLogged) {
      
      case 'autenticado':

          return (
            <>
              <NavBar></NavBar>
                <Routes>
                  <Route path="/" element={ <Dashboard/>} />
                  <Route path="/perfil/:id/*" element={ <Perfil/>} />
                  <Route path="/bandas/crear/*" element={ <BandaForm/>} />
                  <Route path="/buscar/:nombre/*" element={ <MisBandas titulo='Buscar'/>} />
                  <Route path="/banda/:bandaId" element={ <PerfilBanda/>} />
                  <Route path="/estadisticas/*" element={ <Estadisticas/>} />

                  <Route path="/peticiones/:id/*" element={ <Peticiones/>} />
                  <Route path="/modificar/:id/*" element={ <UpdateForm/>} />
                  <Route path="/bandas/:userId/*" element={ <MisBandas titulo='Mis Bandas'/>} />
                  <Route path="/prestamos/:userId/*" element={ <Prestamos/>} />

                  <Route path="/peticiones/banda/:id/*" element={ <PeticionesBanda/>} />
                  <Route path="/bandas/actualizar/:bandaId" element={ <UpdateBandaForm/>} />
                  <Route path="/banda/panel/:bandaId" element={ <PanelDirectivo/>} />
                  <Route path="/banda/panel/redes/:bandaId" element={ <RedesSociales/>} />
                  <Route path="/banda/panel/economia/:bandaId" element={ <Transacciones/>} />
                  <Route path="/banda/panel/eventos/:bandaId" element={ <Eventos/>} />
                  <Route path="/banda/panel/eventos/crear/:bandaId" element={ <CrearEventoForm/>} />
                  <Route path="/banda/panel/eventos/editar/:tipoEvento/:eventoId" element={ <ActualizarEventoForm/>} />
                  <Route path="/banda/panel/eventos/asistencia/:eventoId/:tipoEvento" element={ <AsistenciaEvento/>} />
                  <Route path="/banda/panel/eventos/asistencia/contratar/:eventoId/:tipoEvento" element={ <ContratarMusico/>} />
                  <Route path="/banda/panel/instrumentos/:bandaId" element={ <Instrumentos/>} />
                  <Route path="/banda/panel/vestimentas/:bandaId" element={ <Vestimentas/>} />
                  <Route path="/banda/panel/prestamos/:bandaId" element={ <PrestamosBanda/>} />
                  <Route path="/banda/panel/anuncios/:bandaId" element={ <Anuncios/>} />

                  <Route path="/admin" element={ <Menu/>} />
                  <Route path="/admin/usuarios" element={ <AdministrarUsuarios/>} />
                  <Route path="/admin/bandas" element={ <AdministrarBandas/>} />
                </Routes>
              </>
          );
      case 'no-autenticado':
        return (
          <>
            <NavbarInvitado></NavbarInvitado>
            <Routes>
                <Route path="/" element={ <Inicial/>} />,
                <Route path="/*" element={ <Navigate to="/"/>} />
                <Route path="/auth/login/*" element={ <LoginPage/>} />,
                <Route path="/auth/register/*" element={ <RegisterFrom/>} />
              
        
            </Routes>
          </>
        );
}
    
}
