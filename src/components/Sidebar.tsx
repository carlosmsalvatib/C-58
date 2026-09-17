import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  Scale,
  FileText,
  BarChart3,
  Settings,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  Scale,
  FileText,
  BarChart3,
  Settings,
  dashboard: LayoutDashboard,
  directorio: BookOpen,
  clientes: Users,
  asesorias: Calendar,
  legales: Scale,
  contratos: FileText,
  reportes: BarChart3,
  cms: Settings,
};

export const Sidebar: React.FC = () => {
  const { modulos, activeTab, setActiveTab, currentUser } = useApp();

  // Filter modules based on role and active state
  const accessibleModules = modulos
    .filter(m => m.activo)
    .filter(m => {
      if (currentUser.rol === 'direccion') return true;
      const roles = m.roles_permitidos.split(',').map(r => r.trim());
      return roles.includes(currentUser.rol);
    })
    .sort((a, b) => a.orden - b.orden);

  return (
    <aside id="main-sidebar" className="w-full md:w-64 bg-white border-r border-slate-200 shrink-0 md:min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Módulos del Sistema
        </div>
        <nav className="space-y-1">
          {accessibleModules.map(m => {
            const Icon = ICON_MAP[m.slug] || ICON_MAP[m.icono] || LayoutDashboard;
            const isActive = activeTab === m.slug;
            return (
              <button
                key={m.id}
                id={`sidebar-link-${m.slug}`}
                onClick={() => setActiveTab(m.slug)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#161938] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                <span className="truncate">{m.nombre}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Corporate footer info */}
      <div className="p-4 border-t border-slate-100 text-xs text-slate-500 bg-slate-50/50">
        <div className="font-semibold text-slate-700">Código-58 v2.0</div>
        <div className="text-[11px] text-slate-400">Consultoría & Legaltech</div>
      </div>
    </aside>
  );
};
