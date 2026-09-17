import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { Shield, UserCheck, RefreshCw, LogOut, ChevronDown } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, setCurrentUser, users, config, resetAllData, logout } = useApp();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const getRoleLabel = (rol: UserRole) => {
    switch (rol) {
      case 'direccion':
        return 'Dirección General';
      case 'consultor':
        return 'Consultor Estratégico';
      case 'gestor_legal':
        return 'Gestor Jurídico / Legal';
      case 'comercial':
        return 'Ejecutivo Comercial';
    }
  };

  const getRoleBadgeColor = (rol: UserRole) => {
    switch (rol) {
      case 'direccion':
        return 'bg-purple-900 text-purple-200 border-purple-700';
      case 'consultor':
        return 'bg-teal-900 text-teal-200 border-teal-700';
      case 'gestor_legal':
        return 'bg-blue-900 text-blue-200 border-blue-700';
      case 'comercial':
        return 'bg-amber-900 text-amber-200 border-amber-700';
    }
  };

  return (
    <header id="main-navbar" className="bg-[#161938] text-white border-b border-[#1E224F] shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-[#161938] flex items-center justify-center font-bold text-lg text-white shadow-sm border border-teal-400/30">
            C58
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              {config.sistema_titulo}
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                v{config.version_sistema}
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block truncate max-w-sm">
              {config.lema}
            </p>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Quick role selector */}
          <div className="relative">
            <button
              id="role-selector-button"
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 bg-[#1E224F] hover:bg-[#252a61] border border-slate-700 px-3 py-1.5 rounded-lg text-xs sm:text-sm text-slate-200 transition-colors"
            >
              <UserCheck className="w-4 h-4 text-teal-400" />
              <div className="text-left hidden md:block">
                <div className="font-medium text-white">{currentUser.nombre}</div>
                <div className="text-[10px] text-slate-400">{getRoleLabel(currentUser.rol)}</div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-medium border md:hidden ${getRoleBadgeColor(currentUser.rol)}`}>
                {currentUser.rol}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#1E224F] border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-700/60">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Cambiar Rol de Demostración
                  </p>
                </div>
                {users.map(u => (
                  <button
                    key={u.id}
                    id={`select-role-${u.rol}`}
                    onClick={() => {
                      setCurrentUser(u);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-700/50 flex items-center justify-between transition-colors ${
                      currentUser.id === u.id ? 'bg-teal-500/10 text-teal-300 font-semibold' : 'text-slate-200'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{u.nombre}</div>
                      <div className="text-[10px] text-slate-400">{u.email}</div>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] border ${getRoleBadgeColor(u.rol)}`}>
                      {u.rol}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset Demo Data Button */}
          <button
            id="reset-data-button"
            type="button"
            title="Restablecer datos originales"
            onClick={() => {
              if (window.confirm('¿Desea restablecer todos los datos a los valores iniciales de demostración?')) {
                resetAllData();
              }
            }}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Logout */}
          <button
            id="logout-button"
            type="button"
            title="Cerrar sesión"
            onClick={logout}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
