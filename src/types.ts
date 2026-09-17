export type UserRole = 'direccion' | 'consultor' | 'gestor_legal' | 'comercial';

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: UserRole;
  activo: boolean;
  ultimo_acceso?: string;
}

export type ClienteStatus = 'prospecto' | 'activo' | 'en_consulta' | 'en_legalizacion' | 'finalizado';

export interface Cliente {
  id: number;
  identificacion: string;
  nombre_completo: string;
  email: string;
  telefono: string;
  direccion: string;
  nombre_empresa: string;
  servicios_ofrecidos: string;
  industria: string;
  status: ClienteStatus;
  fecha_registro: string;
  usuario_id_creacion: number;
}

export type AsesoriaTipo = 'diagnostico' | 'seguimiento' | 'cierre';
export type AsesoriaStatus = 'programada' | 'realizada' | 'cancelada';

export interface Asesoria {
  id: number;
  cliente_id: number;
  consultor_id: number;
  tipo: AsesoriaTipo;
  fecha_programada: string;
  fecha_realizada?: string | null;
  duracion_minutos: number;
  tema: string;
  observaciones?: string;
  status: AsesoriaStatus;
}

export interface FormularioDiagnostico {
  id: number;
  cliente_id: number;
  consultor_id: number;
  fecha_aplicacion: string;
  motivacion?: string;
  experiencia?: string;
  disponibilidad?: string;
  descripcion_negocio?: string;
  problema_resuelve?: string;
  publico_objetivo?: string;
  propuesta_valor?: string;
  competidores?: string;
  diferenciacion?: string;
  tamano_mercado?: string;
  inversion_inicial?: number;
  punto_equilibrio?: number;
  proyeccion_ventas?: string;
  estructura_propuesta?: string;
  recursos_necesarios?: string;
  recomendaciones?: string;
  status: 'borrador' | 'completado' | 'aprobado';
}

export type ProcesoLegalStatus = 'pendiente' | 'en_proceso' | 'completado' | 'rechazado';

export interface ProcesoLegal {
  id: number;
  cliente_id: number;
  gestor_id: number;
  tipo_proceso: string;
  nombre_comercial: string;
  documento_identidad: string;
  estado: string;
  fecha_inicio: string;
  fecha_finalizacion?: string | null;
  observaciones?: string;
  status: ProcesoLegalStatus;
}

export interface DocumentoLegal {
  id: number;
  proceso_legal_id: number;
  tipo_documento: string;
  nombre_archivo: string;
  ruta_archivo: string;
  version: number;
  fecha_subida: string;
  usuario_id_subio: number;
  status: 'borrador' | 'pendiente_revision' | 'aprobado' | 'entregado';
}

export type ContratoEstadoPago = 'pendiente' | 'parcial' | 'pagado';
export type ContratoEstado = 'activo' | 'completado' | 'cancelado';

export interface Contrato {
  id: number;
  cliente_id: number;
  comercial_id: number;
  numero_contrato: string;
  fecha_firma: string;
  monto_total: number;
  anticipo: number;
  saldo_pendiente: number;
  fecha_anticipo?: string;
  fecha_inicio_servicio?: string;
  fecha_fin_servicio?: string;
  estado_pago: ContratoEstadoPago;
  estado_contrato: ContratoEstado;
  condiciones?: string;
  observaciones?: string;
}

export interface Pago {
  id: number;
  contrato_id: number;
  monto: number;
  fecha_pago: string;
  metodo_pago: 'efectivo' | 'transferencia' | 'tarjeta' | 'otros';
  referencia: string;
  comprobante?: string;
  status: 'pendiente' | 'verificado' | 'rechazado';
}

export interface Interaccion {
  id: number;
  cliente_id: number;
  usuario_id: number;
  tipo: string;
  canal: string;
  fecha_hora: string;
  descripcion: string;
  seguimiento: boolean;
}

export interface ModuloSistema {
  id: number;
  nombre: string;
  slug: string;
  icono: string;
  descripcion: string;
  activo: boolean;
  orden: number;
  roles_permitidos: string;
}

export interface CatalogoServicio {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  activo: boolean;
}

export interface ConfiguracionSistema {
  nombre_empresa: string;
  sistema_titulo: string;
  version_sistema: string;
  lema: string;
  email_contacto: string;
  telefono_contacto: string;
  direccion_oficina: string;
  dias_plazo_legal: number;
  porcentaje_anticipo: number;
}
