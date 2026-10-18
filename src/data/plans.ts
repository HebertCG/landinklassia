export interface Plan {
  id: string;
  name: string;
  price: number;
  from: boolean;
  students: number;
  storageGB: number;
  description: string;
  tone: string;
  inherits?: string;
  highlights: string[];
  features: string[];
}

export const plans: Plan[] = [
  {
    id: 'inicial', name: 'Inicial', price: 149, from: false, students: 100, storageGB: 100,
    description: 'Lo esencial para organizar tu academia.', tone: 'sky',
    highlights: ['Gestión académica y aula virtual', 'Registro manual de pagos', 'Soporte por correo y WhatsApp'],
    features: ['Gestión de alumnos y docentes', 'Matrículas, cursos y horarios', 'Control de asistencia', 'Registro de notas', 'Aula virtual', 'Publicación de materiales', 'Comunicados y notificaciones', 'Registro manual de pagos y deudas', 'Reportes básicos', 'Backups incluidos', 'Soporte por correo y WhatsApp']
  },
  {
    id: 'basico', name: 'Básico', price: 299, from: false, students: 250, storageGB: 300,
    description: 'Más herramientas para enseñar y gestionar.', tone: 'lime', inherits: 'Inicial',
    highlights: ['Exámenes y calificación automática', 'Reportes académicos y financieros', 'Tu logo y tus colores'],
    features: ['Evaluaciones y exámenes virtuales', 'Calificación automática', 'Gestión de vencimientos y morosidad', 'Reportes académicos y financieros', 'Exportación de información', 'Personalización con logo y colores', 'Importación inicial de alumnos', 'Soporte estándar por WhatsApp']
  },
  {
    id: 'profesional', name: 'Profesional', price: 499, from: false, students: 500, storageGB: 500,
    description: 'Una visión más completa de tu operación.', tone: 'violet', inherits: 'Básico',
    highlights: ['Indicadores y estadísticas avanzadas', 'Dominio personalizado', 'Capacitación y soporte prioritario'],
    features: ['Reportes y estadísticas avanzadas', 'Panel de indicadores', 'Dominio personalizado', 'Roles y permisos administrativos', 'Gestión avanzada de docentes', 'Historial académico completo', 'Importaciones masivas', 'Capacitación inicial incluida', 'Soporte prioritario']
  },
  {
    id: 'institucional', name: 'Institucional', price: 999, from: true, students: 1000, storageGB: 1000,
    description: 'Conecta tus sedes en una misma gestión.', tone: 'coral', inherits: 'Profesional',
    highlights: ['Administración de múltiples sedes', 'Integraciones mediante API', 'Implementación y migración asistidas'],
    features: ['Administración de múltiples sedes', 'Gestión centralizada de alumnos y docentes', 'Reportes consolidados por sede', 'Roles y permisos avanzados', 'Integraciones mediante API', 'Implementación asistida', 'Migración de información', 'Capacitación para administradores', 'Atención prioritaria', 'Soporte especializado']
  }
];

export const storageOptions = [
  { id: 'incluido', label: 'Solo el incluido', gb: 0, price: 0 },
  { id: '100gb', label: '100 GB adicionales', gb: 100, price: 25 },
  { id: '500gb', label: '500 GB adicionales', gb: 500, price: 99 }
] as const;

interface UpcomingService {
  name: string;
  price: number;
  subtitle: string;
  features: string[];
  conditions: string[];
}

export const plusServices: UpcomingService[] = [
  { name: 'Cobros Automáticos', price: 169, subtitle: 'Cobranza recurrente y seguimiento de pagos.',
    features: ['Generación automática de cuotas', 'Programación de cobros recurrentes', 'Recordatorios antes del vencimiento', 'Avisos automáticos de deuda', 'Actualización del estado de pago', 'Seguimiento de pagos pendientes', 'Reportes de recaudación', 'Reportes de morosidad', 'Integración con Cobrana', 'Costos mensuales de Cobrana incluidos'],
    conditions: ['Las comisiones bancarias o de pasarela no están incluidas.', 'Las comisiones se trasladan a la academia o al alumno.'] },
  { name: 'Facturación Electrónica PSE 500', price: 169, subtitle: 'Hasta 500 comprobantes mensuales.',
    features: ['Emisión de boletas electrónicas', 'Emisión de facturas electrónicas', 'Envío automático a SUNAT', 'Generación de PDF y XML', 'Recepción y almacenamiento del CDR', 'Consulta del estado en SUNAT', 'Emisión de notas de crédito', 'Historial de comprobantes', 'Reportes de facturación'],
    conditions: ['Los comprobantes adicionales se cobran aparte; no incluye comprobantes ilimitados.', 'El precio se mantiene si el proveedor cuesta hasta S/99 por academia.'] },
  { name: 'Facturación Electrónica PSE 1,000', price: 199, subtitle: 'Hasta 1,000 comprobantes mensuales.',
    features: ['Todo lo incluido en PSE 500', 'Recomendado para academias de 400 a 500 alumnos', 'Mayor capacidad para boletas, facturas y notas de crédito', 'Reportes mensuales consolidados'],
    conditions: ['Los comprobantes adicionales se cobran aparte.', 'Para más de 1,000 comprobantes se realiza una cotización personalizada.'] }
];

export const combos = [
  { name: 'Finanzas 500', price: 299, saving: 39,
    features: ['Cobros automáticos', 'Hasta 500 comprobantes electrónicos', 'Recordatorios de pago', 'Seguimiento de morosidad', 'Boletas y facturas electrónicas', 'Envío automático a SUNAT', 'Reportes de cobranza y facturación'] },
  { name: 'Finanzas 1,000', price: 349, saving: 19,
    features: ['Cobros automáticos', 'Hasta 1,000 comprobantes electrónicos', 'Todo lo incluido en el Combo Finanzas 500', 'Recomendado para el Plan Profesional'] }
];

export const number = (value: number): string => value.toLocaleString('en-US');
export const storageLabel = (gb: number): string => gb === 1000 ? '1 TB' : `${number(gb)} GB`;
