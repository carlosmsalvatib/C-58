import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { DirectorioView } from './components/DirectorioView';
import { ClientesView } from './components/ClientesView';
import { AsesoriasView } from './components/AsesoriasView';
import { LegalesView } from './components/LegalesView';
import { ContratosView } from './components/ContratosView';
import { ReportesView } from './components/ReportesView';
import { CmsView } from './components/CmsView';
import { LoginView } from './components/LoginView';

const MainLayout: React.FC = () => {
  const { isLoggedIn, activeTab } = useApp();

  if (!isLoggedIn) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'directorio' && <DirectorioView />}
          {activeTab === 'clientes' && <ClientesView />}
          {activeTab === 'asesorias' && <AsesoriasView />}
          {activeTab === 'legales' && <LegalesView />}
          {activeTab === 'contratos' && <ContratosView />}
          {activeTab === 'reportes' && <ReportesView />}
          {activeTab === 'cms' && <CmsView />}
        </main>
      </div>

      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Código-58. Plataforma Integral de Gestión y Formalización para Emprendedores.</span>
          <span className="text-slate-400">Ambiente Web Node.js Migrado</span>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
