import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Cliente,
  Asesoria,
  FormularioDiagnostico,
  ProcesoLegal,
  DocumentoLegal,
  Contrato,
  Pago,
  Interaccion,
  ModuloSistema,
  CatalogoServicio,
  ConfiguracionSistema,
  UserRole,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CONFIG,
  INITIAL_MODULOS,
  INITIAL_SERVICIOS,
  INITIAL_CLIENTES,
  INITIAL_ASESORIAS,
  INITIAL_DIAGNOSTICOS,
  INITIAL_PROCESOS_LEGALES,
  INITIAL_DOCUMENTOS,
  INITIAL_CONTRATOS,
  INITIAL_PAGOS,
  INITIAL_INTERACCIONES,
} from '../data/initialData';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  config: ConfiguracionSistema;
  updateConfig: (newConfig: Partial<ConfiguracionSistema>) => void;
  modulos: ModuloSistema[];
  toggleModulo: (id: number) => void;
  servicios: CatalogoServicio[];
  addServicio: (s: Omit<CatalogoServicio, 'id'>) => void;
  toggleServicio: (id: number) => void;
  clientes: Cliente[];
  addCliente: (c: Omit<Cliente, 'id' | 'fecha_registro' | 'usuario_id_creacion'>) => void;
  updateCliente: (id: number, c: Partial<Cliente>) => void;
  deleteCliente: (id: number) => void;
  asesorias: Asesoria[];
  addAsesoria: (a: Omit<Asesoria, 'id'>) => void;
  updateAsesoria: (id: number, a: Partial<Asesoria>) => void;
  diagnosticos: FormularioDiagnostico[];
  saveDiagnostico: (d: Partial<FormularioDiagnostico> & { cliente_id: number }) => void;
  procesosLegales: ProcesoLegal[];
  addProcesoLegal: (p: Omit<ProcesoLegal, 'id' | 'fecha_inicio'>) => void;
  updateProcesoLegal: (id: number, p: Partial<ProcesoLegal>) => void;
  documentosLegales: DocumentoLegal[];
  addDocumentoLegal: (doc: Omit<DocumentoLegal, 'id' | 'fecha_subida' | 'version'>) => void;
  updateDocumentoStatus: (id: number, status: DocumentoLegal['status']) => void;
  contratos: Contrato[];
  addContrato: (c: Omit<Contrato, 'id' | 'saldo_pendiente'>) => void;
  pagos: Pago[];
  addPago: (p: Omit<Pago, 'id'>) => void;
  updatePagoStatus: (id: number, status: Pago['status']) => void;
  interacciones: Interaccion[];
  addInteraccion: (i: Omit<Interaccion, 'id' | 'fecha_hora'>) => void;
  resetAllData: () => void;
  isLoggedIn: boolean;
  login: (email: string, role?: UserRole) => boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(`c58_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(`c58_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error('Storage error', e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(() =>
    loadFromStorage('user', INITIAL_USERS[0])
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() =>
    loadFromStorage('logged_in', true)
  );
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [config, setConfig] = useState<ConfiguracionSistema>(() =>
    loadFromStorage('config', INITIAL_CONFIG)
  );
  const [modulos, setModulos] = useState<ModuloSistema[]>(() =>
    loadFromStorage('modulos', INITIAL_MODULOS)
  );
  const [servicios, setServicios] = useState<CatalogoServicio[]>(() =>
    loadFromStorage('servicios', INITIAL_SERVICIOS)
  );
  const [clientes, setClientes] = useState<Cliente[]>(() =>
    loadFromStorage('clientes', INITIAL_CLIENTES)
  );
  const [asesorias, setAsesorias] = useState<Asesoria[]>(() =>
    loadFromStorage('asesorias', INITIAL_ASESORIAS)
  );
  const [diagnosticos, setDiagnosticos] = useState<FormularioDiagnostico[]>(() =>
    loadFromStorage('diagnosticos', INITIAL_DIAGNOSTICOS)
  );
  const [procesosLegales, setProcesosLegales] = useState<ProcesoLegal[]>(() =>
    loadFromStorage('procesos_legales', INITIAL_PROCESOS_LEGALES)
  );
  const [documentosLegales, setDocumentosLegales] = useState<DocumentoLegal[]>(() =>
    loadFromStorage('documentos_legales', INITIAL_DOCUMENTOS)
  );
  const [contratos, setContratos] = useState<Contrato[]>(() =>
    loadFromStorage('contratos', INITIAL_CONTRATOS)
  );
  const [pagos, setPagos] = useState<Pago[]>(() =>
    loadFromStorage('pagos', INITIAL_PAGOS)
  );
  const [interacciones, setInteracciones] = useState<Interaccion[]>(() =>
    loadFromStorage('interacciones', INITIAL_INTERACCIONES)
  );

  useEffect(() => saveToStorage('user', currentUser), [currentUser]);
  useEffect(() => saveToStorage('logged_in', isLoggedIn), [isLoggedIn]);
  useEffect(() => saveToStorage('config', config), [config]);
  useEffect(() => saveToStorage('modulos', modulos), [modulos]);
  useEffect(() => saveToStorage('servicios', servicios), [servicios]);
  useEffect(() => saveToStorage('clientes', clientes), [clientes]);
  useEffect(() => saveToStorage('asesorias', asesorias), [asesorias]);
  useEffect(() => saveToStorage('diagnosticos', diagnosticos), [diagnosticos]);
  useEffect(() => saveToStorage('procesos_legales', procesosLegales), [procesosLegales]);
  useEffect(() => saveToStorage('documentos_legales', documentosLegales), [documentosLegales]);
  useEffect(() => saveToStorage('contratos', contratos), [contratos]);
  useEffect(() => saveToStorage('pagos', pagos), [pagos]);
  useEffect(() => saveToStorage('interacciones', interacciones), [interacciones]);

  const updateConfig = (newConfig: Partial<ConfiguracionSistema>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const toggleModulo = (id: number) => {
    setModulos(prev =>
      prev.map(m => (m.id === id ? { ...m, activo: !m.activo } : m))
    );
  };

  const addServicio = (s: Omit<CatalogoServicio, 'id'>) => {
    const newId = Math.max(...servicios.map(x => x.id), 0) + 1;
    setServicios(prev => [...prev, { ...s, id: newId }]);
  };

  const toggleServicio = (id: number) => {
    setServicios(prev =>
      prev.map(s => (s.id === id ? { ...s, activo: !s.activo } : s))
    );
  };

  const addCliente = (c: Omit<Cliente, 'id' | 'fecha_registro' | 'usuario_id_creacion'>) => {
    const newId = Math.max(...clientes.map(x => x.id), 0) + 1;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newCliente: Cliente = {
      ...c,
      id: newId,
      fecha_registro: now,
      usuario_id_creacion: currentUser.id,
    };
    setClientes(prev => [newCliente, ...prev]);
  };

  const updateCliente = (id: number, c: Partial<Cliente>) => {
    setClientes(prev => prev.map(cl => (cl.id === id ? { ...cl, ...c } : cl)));
  };

  const deleteCliente = (id: number) => {
    setClientes(prev => prev.filter(cl => cl.id !== id));
  };

  const addAsesoria = (a: Omit<Asesoria, 'id'>) => {
    const newId = Math.max(...asesorias.map(x => x.id), 0) + 1;
    setAsesorias(prev => [{ ...a, id: newId }, ...prev]);
  };

  const updateAsesoria = (id: number, a: Partial<Asesoria>) => {
    setAsesorias(prev => prev.map(as => (as.id === id ? { ...as, ...a } : as)));
  };

  const saveDiagnostico = (d: Partial<FormularioDiagnostico> & { cliente_id: number }) => {
    setDiagnosticos(prev => {
      const idx = prev.findIndex(x => x.cliente_id === d.cliente_id);
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...d, fecha_aplicacion: now };
        return updated;
      } else {
        const newId = Math.max(...prev.map(x => x.id), 0) + 1;
        const nuevo: FormularioDiagnostico = {
          id: newId,
          cliente_id: d.cliente_id,
          consultor_id: currentUser.id,
          fecha_aplicacion: now,
          status: 'completado',
          ...d,
        };
        return [nuevo, ...prev];
      }
    });
  };

  const addProcesoLegal = (p: Omit<ProcesoLegal, 'id' | 'fecha_inicio'>) => {
    const newId = Math.max(...procesosLegales.map(x => x.id), 0) + 1;
    const now = new Date().toISOString().substring(0, 10);
    setProcesosLegales(prev => [{ ...p, id: newId, fecha_inicio: now }, ...prev]);
  };

  const updateProcesoLegal = (id: number, p: Partial<ProcesoLegal>) => {
    setProcesosLegales(prev => prev.map(pl => (pl.id === id ? { ...pl, ...p } : pl)));
  };

  const addDocumentoLegal = (doc: Omit<DocumentoLegal, 'id' | 'fecha_subida' | 'version'>) => {
    const newId = Math.max(...documentosLegales.map(x => x.id), 0) + 1;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setDocumentosLegales(prev => [
      ...prev,
      {
        ...doc,
        id: newId,
        version: 1,
        fecha_subida: now,
        usuario_id_subio: currentUser.id,
      },
    ]);
  };

  const updateDocumentoStatus = (id: number, status: DocumentoLegal['status']) => {
    setDocumentosLegales(prev => prev.map(d => (d.id === id ? { ...d, status } : d)));
  };

  const addContrato = (c: Omit<Contrato, 'id' | 'saldo_pendiente'>) => {
    const newId = Math.max(...contratos.map(x => x.id), 0) + 1;
    const saldo = Math.max(0, c.monto_total - c.anticipo);
    setContratos(prev => [
      {
        ...c,
        id: newId,
        saldo_pendiente: saldo,
        comercial_id: currentUser.id,
      },
      ...prev,
    ]);
  };

  const addPago = (p: Omit<Pago, 'id'>) => {
    const newId = Math.max(...pagos.map(x => x.id), 0) + 1;
    const nuevoPago = { ...p, id: newId };
    setPagos(prev => [nuevoPago, ...prev]);

    // Update contrato saldo
    setContratos(prev =>
      prev.map(c => {
        if (c.id === p.contrato_id) {
          const nuevoSaldo = Math.max(0, c.saldo_pendiente - p.monto);
          return {
            ...c,
            saldo_pendiente: nuevoSaldo,
            estado_pago: nuevoSaldo === 0 ? 'pagado' : 'parcial',
          };
        }
        return c;
      })
    );
  };

  const updatePagoStatus = (id: number, status: Pago['status']) => {
    setPagos(prev => prev.map(p => (p.id === id ? { ...p, status } : p)));
  };

  const addInteraccion = (i: Omit<Interaccion, 'id' | 'fecha_hora'>) => {
    const newId = Math.max(...interacciones.map(x => x.id), 0) + 1;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setInteracciones(prev => [{ ...i, id: newId, fecha_hora: now }, ...prev]);
  };

  const resetAllData = () => {
    localStorage.clear();
    setConfig(INITIAL_CONFIG);
    setModulos(INITIAL_MODULOS);
    setServicios(INITIAL_SERVICIOS);
    setClientes(INITIAL_CLIENTES);
    setAsesorias(INITIAL_ASESORIAS);
    setDiagnosticos(INITIAL_DIAGNOSTICOS);
    setProcesosLegales(INITIAL_PROCESOS_LEGALES);
    setDocumentosLegales(INITIAL_DOCUMENTOS);
    setContratos(INITIAL_CONTRATOS);
    setPagos(INITIAL_PAGOS);
    setInteracciones(INITIAL_INTERACCIONES);
    setCurrentUser(INITIAL_USERS[0]);
    setIsLoggedIn(true);
    setActiveTab('dashboard');
  };

  const login = (email: string, role?: UserRole): boolean => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      setIsLoggedIn(true);
      return true;
    }
    if (role) {
      const fallbackUser: User = {
        id: 99,
        nombre: email.split('@')[0],
        email,
        rol: role,
        activo: true,
      };
      setCurrentUser(fallbackUser);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        activeTab,
        setActiveTab,
        config,
        updateConfig,
        modulos,
        toggleModulo,
        servicios,
        addServicio,
        toggleServicio,
        clientes,
        addCliente,
        updateCliente,
        deleteCliente,
        asesorias,
        addAsesoria,
        updateAsesoria,
        diagnosticos,
        saveDiagnostico,
        procesosLegales,
        addProcesoLegal,
        updateProcesoLegal,
        documentosLegales,
        addDocumentoLegal,
        updateDocumentoStatus,
        contratos,
        addContrato,
        pagos,
        addPago,
        updatePagoStatus,
        interacciones,
        addInteraccion,
        resetAllData,
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
