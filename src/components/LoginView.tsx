import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, KeyRound, Mail, ArrowRight, UserCheck } from 'lucide-react';
import { UserRole } from '../types';

export const LoginView: React.FC = () => {
  const { login, config, users } = useApp();
  const [email, setEmail] = useState('admin@consultoria.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email);
    if (!success) {
      setError('Credenciales incorrectas. Puede usar una de las cuentas de demostración abajo.');
    }
  };

  const handleQuickLogin = (demoEmail: string, role: UserRole) => {
    setEmail(demoEmail);
    login(demoEmail, role);
  };

  return (
    <div id="login-view" className="min-h-screen bg-gradient-to-br from-[#161938] via-[#1E224F] to-[#0A0D24] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden border border-slate-100">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-teal-500 to-[#161938] flex items-center justify-center font-bold text-2xl text-white shadow-md border border-teal-400/30">
            C58
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {config.sistema_titulo}
          </h2>
          <p className="text-xs text-slate-500">
            {config.lema}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                id="login-email-input"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="admin@consultoria.com"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Contraseña</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                id="login-password-input"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            className="w-full py-2.5 px-4 rounded-lg bg-[#161938] hover:bg-[#1E224F] text-white font-semibold flex items-center justify-center gap-2 transition shadow-md"
          >
            Iniciar Sesión
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Access Roles */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
            Acceso Rápido de Demostración
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@consultoria.com', 'direccion')}
              className="p-2 rounded-lg bg-slate-50 hover:bg-teal-50 hover:text-teal-800 border border-slate-200 text-left transition"
            >
              <div className="font-bold text-slate-800 text-[11px]">Dirección</div>
              <div className="text-[10px] text-slate-400">admin@consultoria.com</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('consultor@consultoria.com', 'consultor')}
              className="p-2 rounded-lg bg-slate-50 hover:bg-teal-50 hover:text-teal-800 border border-slate-200 text-left transition"
            >
              <div className="font-bold text-slate-800 text-[11px]">Consultor</div>
              <div className="text-[10px] text-slate-400">consultor@consultoria.com</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('legal@consultoria.com', 'gestor_legal')}
              className="p-2 rounded-lg bg-slate-50 hover:bg-teal-50 hover:text-teal-800 border border-slate-200 text-left transition"
            >
              <div className="font-bold text-slate-800 text-[11px]">Gestor Legal</div>
              <div className="text-[10px] text-slate-400">legal@consultoria.com</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('comercial@consultoria.com', 'comercial')}
              className="p-2 rounded-lg bg-slate-50 hover:bg-teal-50 hover:text-teal-800 border border-slate-200 text-left transition"
            >
              <div className="font-bold text-slate-800 text-[11px]">Comercial</div>
              <div className="text-[10px] text-slate-400">comercial@consultoria.com</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
