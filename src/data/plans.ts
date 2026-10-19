export interface Plan {
  id: string;
  name: string;
  price: number;
  comingSoon?: boolean;
  students: number;
  storageGB: number;
  description: string;
  tone: string;
  inherits?: string;
  highlights: string[];
  features: string[];
  upcomingFeatures?: string[];
}

export const plans: Plan[] = [
  {
    id: 'inicial', name: 'Inicial', price: 149, students: 100, storageGB: 100,
    description: 'Lo esencial para organizar tu academia.', tone: 'sky',
    highlights: ['Gestión académica, tareas y materiales', 'Pagos manuales y en línea', 'Klassia Go y Ruleta'],
    features: ['Gestión académica de alumnos y docentes', 'Matrículas, cursos y horarios', 'Control de asistencia y registro de notas', 'Aula virtual, tareas y materiales', 'Comunicados y notificaciones', 'Registro manual de pagos y deudas', 'Pagos en línea', 'Reportes', 'Klassia Go', 'Ruleta', 'Backups incluidos', 'Soporte por correo y WhatsApp']
  },
  {
    id: 'basico', name: 'Básico', price: 299, students: 250, storageGB: 300,
    description: 'Más herramientas para enseñar y gestionar.', tone: 'lime', inherits: 'Inicial',
    highlights: ['Exámenes virtuales y test vocacional', 'Tu logo y tus colores', 'Importación masiva y exportación'],
    features: ['Evaluaciones y exámenes virtuales', 'Test vocacional', 'Personalización con logo y colores', 'Importación masiva de alumnos', 'Exportación de información']
  },
  {
    id: 'profesional', name: 'Profesional', price: 499, students: 500, storageGB: 500,
    description: 'Las herramientas de Básico, con más capacidad.', tone: 'violet', inherits: 'Básico',
    highlights: ['Todas las funciones de Básico', 'Importación masiva y exportación', 'Más alumnos y espacio para crecer'],
    features: ['Las mismas funciones del Plan Básico', 'Capacidad para hasta 500 alumnos activos', '500 GB de almacenamiento']
  },
  {
    id: 'institucional', name: 'Institucional', price: 999, comingSoon: true, students: 1000, storageGB: 1000,
    description: 'El siguiente nivel para academias más grandes.', tone: 'coral', inherits: 'Profesional',
    highlights: ['Todas las funciones de Profesional', 'Importación masiva y exportación', 'Más capacidad para tu academia'],
    features: ['Las mismas funciones del Plan Profesional', 'Capacidad para hasta 1,000 alumnos activos', '1 TB de almacenamiento'],
    upcomingFeatures: ['Administración de múltiples sedes', 'Integraciones mediante API', 'Roles y permisos avanzados']
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
  { name: 'Cobros Automáticos', price: 99, subtitle: 'Cobranza recurrente y seguimiento de pagos.',
    features: ['Generación automática de cuotas', 'Programación de cobros recurrentes', 'Recordatorios antes del vencimiento', 'Avisos automáticos de deuda', 'Actualización del estado de pago', 'Seguimiento de pagos pendientes', 'Reportes de recaudación', 'Reportes de morosidad', 'Integración con Cobrana', 'Costos mensuales de Cobrana incluidos'],
    conditions: ['Las comisiones bancarias o de pasarela no están incluidas.', 'Las comisiones se trasladan a la academia o al alumno.'] },
  { name: 'Facturación Electrónica PSE 500', price: 45, subtitle: 'Hasta 500 comprobantes mensuales.',
    features: ['Emisión de boletas electrónicas', 'Emisión de facturas electrónicas', 'Envío automático a SUNAT', 'Generación de PDF y XML', 'Recepción y almacenamiento del CDR', 'Consulta del estado en SUNAT', 'Emisión de notas de crédito', 'Historial de comprobantes', 'Reportes de facturación'],
    conditions: ['Los comprobantes adicionales se cobran aparte; no incluye comprobantes ilimitados.'] },
  { name: 'Facturación Electrónica PSE 1,000', price: 69, subtitle: 'Hasta 1,000 comprobantes mensuales.',
    features: ['Todo lo incluido en PSE 500', 'Recomendado para academias de 400 a 500 alumnos', 'Mayor capacidad para boletas, facturas y notas de crédito', 'Reportes mensuales consolidados'],
    conditions: ['Los comprobantes adicionales se cobran aparte.', 'Para más de 1,000 comprobantes se realiza una cotización personalizada.'] }
];

export const combos = [
  { name: 'Finanzas 500', price: 129, saving: 15,
    features: ['Cobros automáticos', 'Hasta 500 comprobantes electrónicos', 'Recordatorios de pago', 'Seguimiento de morosidad', 'Boletas y facturas electrónicas', 'Envío automático a SUNAT', 'Reportes de cobranza y facturación'] },
  { name: 'Finanzas 1,000', price: 149, saving: 19,
    features: ['Cobros automáticos', 'Hasta 1,000 comprobantes electrónicos', 'Todo lo incluido en el Combo Finanzas 500', 'Recomendado para el Plan Profesional'] }
];

export const number = (value: number): string => value.toLocaleString('en-US');
export const storageLabel = (gb: number): string => gb === 1000 ? '1 TB' : `${number(gb)} GB`;
