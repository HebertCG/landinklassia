export type Support = 'full' | 'partial' | 'none';

export interface ComparisonRow {
  feature: string;
  detail: string;
  klassia: Support;
  spreadsheets: Support;
  genericLms: Support;
  schoolErp: Support;
}

export interface Alternative {
  key: 'spreadsheets' | 'genericLms' | 'schoolErp';
  name: string;
  what: string;
  limit: string;
}

/**
 * Klassia is compared against categories of tool, not against named products.
 * Each column describes how that category of tool typically behaves for a
 * Peruvian pre-university academy.
 */
export const alternatives: Alternative[] = [
  {
    key: 'spreadsheets',
    name: 'Hojas de cálculo y chats',
    what: 'La combinación más común: Excel o Sheets para el padrón y las notas, y grupos de WhatsApp para coordinar y repartir material.',
    limit: 'Nada está conectado. La misma información se copia varias veces y nadie sabe cuál archivo es el bueno.'
  },
  {
    key: 'genericLms',
    name: 'LMS genérico',
    what: 'Plataformas de cursos pensadas para educación en línea o capacitación corporativa, adaptadas a la fuerza al aula presencial.',
    limit: 'No entienden ciclos, grupos por universidad objetivo ni asistencia presencial por sesión.'
  },
  {
    key: 'schoolErp',
    name: 'ERP escolar',
    what: 'Sistemas administrativos diseñados para colegios regulares, con año escolar, bimestres, libretas y nómina.',
    limit: 'El modelo de colegio no calza con una academia: ciclos cortos, grupos que cambian y alumnos egresados.'
  }
];

export const comparisonRows: ComparisonRow[] = [
  {
    feature: 'Ciclos preuniversitarios',
    detail: 'Ciclos cortos y repetidos (verano, anual, intensivo) en lugar de un año escolar con bimestres.',
    klassia: 'full', spreadsheets: 'partial', genericLms: 'none', schoolErp: 'none'
  },
  {
    feature: 'Grupos por universidad objetivo',
    detail: 'Organizar a los alumnos por UNI, San Marcos, Villarreal o integral, no solo por grado.',
    klassia: 'full', spreadsheets: 'partial', genericLms: 'none', schoolErp: 'none'
  },
  {
    feature: 'Asistencia presencial por sesión',
    detail: 'Presente, tardanza o falta marcados en la clase y conectados al expediente del alumno.',
    klassia: 'full', spreadsheets: 'partial', genericLms: 'none', schoolErp: 'full'
  },
  {
    feature: 'Alumnos egresados',
    detail: 'Un postulante que ya terminó el colegio es un caso normal, no una excepción del sistema.',
    klassia: 'full', spreadsheets: 'full', genericLms: 'partial', schoolErp: 'none'
  },
  {
    feature: 'Evaluaciones con fórmulas e imágenes',
    detail: 'Enunciados con notación matemática y diagramas, indispensables en Álgebra o Física.',
    klassia: 'full', spreadsheets: 'none', genericLms: 'partial', schoolErp: 'none'
  },
  {
    feature: 'Importar banco de preguntas DOCX',
    detail: 'Reutilizar el material que la academia ya escribió en Word en lugar de volver a tipearlo.',
    klassia: 'full', spreadsheets: 'none', genericLms: 'none', schoolErp: 'none'
  },
  {
    feature: 'Participación en clase con PIN',
    detail: 'Repaso en vivo desde el celular del alumno, sin crear cuentas nuevas ni instalar nada.',
    klassia: 'full', spreadsheets: 'none', genericLms: 'partial', schoolErp: 'none'
  },
  {
    feature: 'Subdominio e identidad propios',
    detail: 'La academia opera en su propia dirección y con su propia identidad visual.',
    klassia: 'full', spreadsheets: 'none', genericLms: 'partial', schoolErp: 'partial'
  },
  {
    feature: 'Datos aislados por academia',
    detail: 'La información de una organización no comparte contexto con la de otra.',
    klassia: 'full', spreadsheets: 'none', genericLms: 'partial', schoolErp: 'full'
  },
  {
    feature: 'Experiencia distinta por rol',
    detail: 'Administración, docentes y estudiantes ven flujos pensados para lo que cada uno hace.',
    klassia: 'full', spreadsheets: 'none', genericLms: 'full', schoolErp: 'partial'
  },
  {
    feature: 'Reportes sin trabajo manual',
    detail: 'El consolidado del ciclo sale del sistema en lugar de armarse a mano cada vez.',
    klassia: 'full', spreadsheets: 'none', genericLms: 'partial', schoolErp: 'full'
  },
  {
    feature: 'Puesta en marcha en días',
    detail: 'Importar el padrón y empezar el ciclo, sin un proyecto de implementación largo.',
    klassia: 'full', spreadsheets: 'full', genericLms: 'partial', schoolErp: 'none'
  }
];

export const supportLabel: Record<Support, string> = {
  full: 'Sí',
  partial: 'Parcial',
  none: 'No'
};
