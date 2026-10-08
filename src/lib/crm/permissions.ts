export type CrmRole =
  | 'SUPER_ADMIN'
  | 'DIRECTORA'
  | 'COORDINADOR'
  | 'TRABAJADOR_SOCIAL'
  | 'PSICOLOGO'
  | 'ABOGADO'
  | 'GESTOR_PROGRAMAS'
  | 'GESTOR_DONANTES'
  | 'GESTOR_FINANCIERO'
  | 'VOLUNTARIO'
  | 'CONSULTA';

export const CRM_ROLES_LIST: { id: CrmRole; label: string; description: string; badgeColor: string }[] = [
  {
    id: 'SUPER_ADMIN',
    label: 'Super Administrador',
    description: 'Gestión técnica global, usuarios, roles, logs de auditoría y configuración del sistema.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  {
    id: 'DIRECTORA',
    label: 'Directora Ejecutiva',
    description: 'Acceso total institucional: personas, casos, finanzas de alto monto, donaciones, proyectos y reportes.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
  },
  {
    id: 'COORDINADOR',
    label: 'Coordinador(a) General',
    description: 'Coordinación operativa de programas, proyectos, asignación de profesionales y aprobación básica de gastos.',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  },
  {
    id: 'TRABAJADOR_SOCIAL',
    label: 'Trabajo Social',
    description: 'Atención de casos asignados, caracterización de hogares, visitas domiciliarias y seguimientos.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
  },
  {
    id: 'PSICOLOGO',
    label: 'Psicología / Salud Mental',
    description: 'Contención emocional, triaje clínico, notas de caso confidenciales y planes de atención psicosocial.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  {
    id: 'ABOGADO',
    label: 'Asesoría Jurídica',
    description: 'Acompañamiento legal Ley 1257/2008, medidas de protección, remisiones a Comisarías y notas legales.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  {
    id: 'GESTOR_PROGRAMAS',
    label: 'Gestor(a) de Programas (CAM/THEMIS)',
    description: 'Inscripciones a líneas productivas CAM, control de cohortes, asistencia a talleres y proyectos.',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
  },
  {
    id: 'GESTOR_DONANTES',
    label: 'Recaudación y Donantes',
    description: 'Gestión de donantes individuales/corporativos, campañas de recaudación, certificados y subvenciones.',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-300',
  },
  {
    id: 'GESTOR_FINANCIERO',
    label: 'Gestión Financiera y Contable',
    description: 'Proveedores, contratos, presupuestos, gastos, cuentas por pagar, pagos y activos.',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
  },
  {
    id: 'VOLUNTARIO',
    label: 'Voluntariado',
    description: 'Consulta de turnos asignados, registro de horas de voluntariado y participación en eventos.',
    badgeColor: 'bg-lime-100 text-lime-800 border-lime-300',
  },
  {
    id: 'CONSULTA',
    label: 'Auditoría / Solo Consulta',
    description: 'Acceso de solo lectura a estadísticas consolidadas e indicadores agregados de impacto.',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
  },
];

export type Permission =
  | 'users.manage'
  | 'audit.read'
  | 'config.manage'
  | 'people.read'
  | 'people.write'
  | 'people.export'
  | 'cases.read'
  | 'cases.write'
  | 'cases.notes_read'
  | 'cases.notes_write'
  | 'cases.close'
  | 'cases.reopen'
  | 'appointments.read'
  | 'appointments.write'
  | 'programs.read'
  | 'programs.write'
  | 'operations.read'
  | 'operations.write'
  | 'donations.read'
  | 'donations.write'
  | 'donations.export'
  | 'grants.read'
  | 'grants.write'
  | 'volunteers.read'
  | 'volunteers.write'
  | 'finance.read'
  | 'finance.write'
  | 'finance.approve_basic'
  | 'finance.approve_high'
  | 'finance.export'
  | 'payroll.read'
  | 'payroll.write'
  | 'providers.read'
  | 'providers.write'
  | 'certificates.read'
  | 'certificates.write'
  | 'certificates.export'
  | 'assets.read'
  | 'assets.write'
  | 'reports.read'
  | 'reports.export'
  | 'tasks.manage';

export const ROLE_PERMISSIONS: Record<CrmRole, Permission[]> = {
  SUPER_ADMIN: [
    'users.manage',
    'audit.read',
    'config.manage',
    'people.read',
    'people.write',
    'people.export',
    'cases.read',
    'cases.write',
    'cases.notes_read',
    'cases.notes_write',
    'cases.close',
    'cases.reopen',
    'appointments.read',
    'appointments.write',
    'programs.read',
    'programs.write',
    'operations.read',
    'operations.write',
    'donations.read',
    'donations.write',
    'donations.export',
    'grants.read',
    'grants.write',
    'volunteers.read',
    'volunteers.write',
    'finance.read',
    'finance.write',
    'finance.approve_basic',
    'finance.approve_high',
    'finance.export',
    'payroll.read',
    'payroll.write',
    'providers.read',
    'providers.write',
    'certificates.read',
    'certificates.write',
    'certificates.export',
    'assets.read',
    'assets.write',
    'reports.read',
    'reports.export',
    'tasks.manage',
  ],
  DIRECTORA: [
    'users.manage',
    'audit.read',
    'config.manage',
    'people.read',
    'people.write',
    'people.export',
    'cases.read',
    'cases.write',
    'cases.notes_read',
    'cases.close',
    'cases.reopen',
    'appointments.read',
    'appointments.write',
    'programs.read',
    'programs.write',
    'operations.read',
    'operations.write',
    'donations.read',
    'donations.write',
    'donations.export',
    'grants.read',
    'grants.write',
    'volunteers.read',
    'volunteers.write',
    'finance.read',
    'finance.write',
    'finance.approve_basic',
    'finance.approve_high',
    'finance.export',
    'payroll.read',
    'payroll.write',
    'providers.read',
    'providers.write',
    'assets.read',
    'assets.write',
    'reports.read',
    'reports.export',
    'tasks.manage',
  ],
  COORDINADOR: [
    'people.read',
    'people.write',
    'cases.read',
    'cases.write',
    'appointments.read',
    'appointments.write',
    'programs.read',
    'programs.write',
    'operations.read',
    'operations.write',
    'donations.read',
    'grants.read',
    'volunteers.read',
    'volunteers.write',
    'finance.read',
    'finance.write',
    'finance.approve_basic',
    'payroll.read',
    'payroll.write',
    'providers.read',
    'providers.write',
    'assets.read',
    'assets.write',
    'reports.read',
    'reports.export',
    'tasks.manage',
  ],
  TRABAJADOR_SOCIAL: [
    'people.read',
    'people.write',
    'cases.read',
    'cases.write',
    'cases.notes_read',
    'cases.notes_write',
    'cases.close',
    'appointments.read',
    'appointments.write',
    'programs.read',
    'operations.read',
    'assets.read',
    'reports.read',
    'tasks.manage',
  ],
  PSICOLOGO: [
    'people.read',
    'cases.read',
    'cases.write',
    'cases.notes_read',
    'cases.notes_write',
    'cases.close',
    'appointments.read',
    'appointments.write',
    'programs.read',
    'operations.read',
    'reports.read',
    'tasks.manage',
  ],
  ABOGADO: [
    'people.read',
    'cases.read',
    'cases.write',
    'cases.notes_read',
    'cases.notes_write',
    'cases.close',
    'appointments.read',
    'appointments.write',
    'programs.read',
    'operations.read',
    'reports.read',
    'tasks.manage',
  ],
  GESTOR_PROGRAMAS: [
    'people.read',
    'people.write',
    'cases.read',
    'appointments.read',
    'programs.read',
    'programs.write',
    'operations.read',
    'operations.write',
    'finance.read',
    'assets.read',
    'reports.read',
    'reports.export',
    'tasks.manage',
  ],
  GESTOR_DONANTES: [
    'people.read',
    'donations.read',
    'donations.write',
    'donations.export',
    'grants.read',
    'grants.write',
    'operations.read',
    'reports.read',
    'tasks.manage',
  ],
  GESTOR_FINANCIERO: [
    'people.read',
    'finance.read',
    'finance.write',
    'finance.approve_basic',
    'finance.approve_high',
    'finance.export',
    'payroll.read',
    'payroll.write',
    'providers.read',
    'providers.write',
    'assets.read',
    'assets.write',
    'donations.read',
    'operations.read',
    'reports.read',
    'reports.export',
    'tasks.manage',
  ],
  VOLUNTARIO: [
    'volunteers.read',
    'operations.read',
    'tasks.manage',
  ],
  CONSULTA: [
    'reports.read',
  ],
};

export function hasPermission(role: CrmRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

export function canAccessModule(role: CrmRole, moduleName: string): boolean {
  switch (moduleName) {
    case 'dashboard':
      return true;
    case 'citas':
      return hasPermission(role, 'appointments.read') || hasPermission(role, 'people.read') || role === 'SUPER_ADMIN' || role === 'DIRECTORA';
    case 'personas':
      return hasPermission(role, 'people.read');
    case 'hogares':
      return hasPermission(role, 'people.read') && (role === 'SUPER_ADMIN' || role === 'DIRECTORA' || role === 'COORDINADOR' || role === 'TRABAJADOR_SOCIAL');
    case 'casos':
      return hasPermission(role, 'cases.read');
    case 'programas':
      return hasPermission(role, 'programs.read');
    case 'proyectos':
      return hasPermission(role, 'programs.read') || hasPermission(role, 'finance.read');
    case 'operaciones':
      return hasPermission(role, 'operations.read');
    case 'voluntarios':
      return hasPermission(role, 'volunteers.read');
    case 'donantes':
      return hasPermission(role, 'donations.read');
    case 'subvenciones':
      return hasPermission(role, 'grants.read');
    case 'finanzas':
    case 'nominas':
    case 'proveedores':
      return hasPermission(role, 'finance.read');
    case 'certificados':
      return hasPermission(role, 'certificates.read') || hasPermission(role, 'donations.read') || role === 'SUPER_ADMIN' || role === 'DIRECTORA';
    case 'activos':
      return hasPermission(role, 'assets.read');
    case 'tareas':
      return hasPermission(role, 'tasks.manage');
    case 'impacto':
    case 'reportes':
      return hasPermission(role, 'reports.read');
    case 'configuracion':
      return hasPermission(role, 'users.manage') || hasPermission(role, 'config.manage') || hasPermission(role, 'audit.read');
    default:
      return false;
  }
}

