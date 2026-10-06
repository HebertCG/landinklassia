export type Tone = 'blue' | 'yellow' | 'mint' | 'violet' | 'coral' | 'sky';

export interface Capability {
  title: string;
  text: string;
}

export interface Module {
  /** URL segment under /plataforma/ */
  slug: string;
  /** Short name used in navigation and cards */
  name: string;
  eyebrow: string;
  /** H1 of the module page */
  headline: string;
  /** One line used on cards */
  tagline: string;
  /** Paragraph used on the module page hero and the platform index */
  summary: string;
  /** Three proof points shown on the card */
  bullets: string[];
  /** Base filename in /public/product (without extension or -1x suffix) */
  shot: string;
  shotAlt: string;
  shotWidth: number;
  shotHeight: number;
  tone: Tone;
  icon: string;
  /** Detail sections of the module page */
  capabilities: Capability[];
  /** What the academy stops doing by hand */
  replaces: string[];
}

export const modules: Module[] = [
  {
    slug: 'gestion-academica',
    name: 'Gestión académica',
    eyebrow: 'Personas y grupos',
    headline: 'Cada alumno, en un solo expediente.',
    tagline: 'Alumnos, docentes y grupos sin archivos paralelos.',
    summary:
      'Matrículas, traslados, asignación de cursos e importación masiva de alumnos desde un mismo lugar. El estado de cada estudiante deja de vivir en un archivo que alguien tiene que actualizar a mano.',
    bullets: ['Importación por CSV', 'Traslados entre grupos', 'Estados de seguimiento'],
    shot: 'alumnos',
    shotAlt: 'Listado de alumnos de Klassia con grupo, asistencia, promedio y estado de cada estudiante',
    shotWidth: 2960,
    shotHeight: 1320,
    tone: 'blue',
    icon: 'users',
    capabilities: [
      { title: 'Matrícula y traslados', text: 'Registra el ingreso de un alumno, muévelo de grupo a mitad de ciclo y conserva su historial académico completo.' },
      { title: 'Importación masiva', text: 'Carga el padrón de un ciclo entero desde un CSV en lugar de crear los alumnos uno por uno.' },
      { title: 'Grupos y ciclos', text: 'Organiza por ciclo, grupo y universidad objetivo, que es como realmente trabaja una academia preuniversitaria.' },
      { title: 'Estados visibles', text: 'Activo, en seguimiento, en riesgo o trasladado. El estado se calcula con la asistencia y las notas que ya están en el sistema.' }
    ],
    replaces: ['Padrones en hojas de cálculo', 'Fichas de matrícula en papel', 'Listas duplicadas por docente']
  },
  {
    slug: 'horarios-y-asistencia',
    name: 'Horarios y asistencia',
    eyebrow: 'Operación diaria',
    headline: 'La operación del día, resuelta antes de que empiece.',
    tagline: 'Sesiones por grupo y asistencia que sí se consulta después.',
    summary:
      'Arma el horario semanal por grupo, aula y docente, y registra presente, tardanza o ausencia en la misma sesión. La asistencia queda conectada al expediente del alumno, no en un cuaderno aparte.',
    bullets: ['Horario semanal por grupo', 'Registro en segundos', 'Alertas por inasistencia'],
    shot: 'horarios',
    shotAlt: 'Horario semanal de Klassia con las sesiones de cada curso por día, aula y docente',
    shotWidth: 2960,
    shotHeight: 1240,
    tone: 'yellow',
    icon: 'calendar',
    capabilities: [
      { title: 'Horario por grupo', text: 'Cada grupo tiene su malla semanal con curso, aula, hora y docente asignado.' },
      { title: 'Registro por sesión', text: 'El docente marca presente, tardanza o falta desde la lista del grupo, sin salir de la clase.' },
      { title: 'Historial del grupo', text: 'La asistencia de las últimas sesiones se ve en una sola vista para detectar caídas a tiempo.' },
      { title: 'Señales de riesgo', text: 'Klassia resalta a los alumnos que acumulan faltas seguidas para que coordinación pueda intervenir.' }
    ],
    replaces: ['Cuadernos de asistencia', 'Horarios pegados en la pared', 'Conteos manuales a fin de mes']
  },
  {
    slug: 'contenido-y-tareas',
    name: 'Contenido y tareas',
    eyebrow: 'Aprendizaje',
    headline: 'Material y entregas, en el mismo sitio donde está la clase.',
    tagline: 'Separatas, tareas y entregas sin enlaces sueltos.',
    summary:
      'Publica separatas, guías y grabaciones por curso, asigna tareas con fecha de entrega y revisa lo que llega. El alumno encuentra el material donde espera encontrarlo: en su curso.',
    bullets: ['Material por curso', 'Entregas con fecha límite', 'Publicación programada'],
    shot: 'contenido',
    shotAlt: 'Vista de contenido de un curso en Klassia con materiales publicados, tareas activas y entregas por revisar',
    shotWidth: 2960,
    shotHeight: 1256,
    tone: 'mint',
    icon: 'file',
    capabilities: [
      { title: 'Biblioteca por curso', text: 'PDF, documentos, hojas de cálculo y grabaciones quedan ordenados por curso y por semana.' },
      { title: 'Publicación programada', text: 'Deja lista la separata de la semana 5 y que aparezca el día que corresponde.' },
      { title: 'Tareas con seguimiento', text: 'Cada tarea muestra cuántos entregaron y cuántos faltan, sin tener que preguntar en el grupo.' },
      { title: 'Bandeja de revisión', text: 'Las entregas llegan a una sola bandeja con el curso, el alumno y el momento de envío.' }
    ],
    replaces: ['Archivos por chat', 'Carpetas compartidas sin orden', 'Listas de entregas a mano']
  },
  {
    slug: 'evaluaciones',
    name: 'Evaluaciones',
    eyebrow: 'Medición',
    headline: 'Exámenes que se arman rápido y se corrigen solos.',
    tagline: 'Fórmulas, imágenes e importación desde DOCX.',
    summary:
      'Crea exámenes con notación matemática, diagramas e imágenes, define duración e intentos, y publica cuando quieras. Si ya tienes un banco de preguntas en Word, se importa en lugar de volver a escribirlo.',
    bullets: ['Editor de fórmulas', 'Importación DOCX', 'Resultados automáticos'],
    shot: 'evaluaciones',
    shotAlt: 'Editor de exámenes de Klassia con preguntas de opción múltiple, fórmulas, imágenes y configuración de la evaluación',
    shotWidth: 2960,
    shotHeight: 1720,
    tone: 'violet',
    icon: 'edit',
    capabilities: [
      { title: 'Notación matemática', text: 'Escribe enunciados con fórmulas reales, imprescindible en Álgebra, Física o Trigonometría.' },
      { title: 'Preguntas con imagen', text: 'Adjunta diagramas de cuerpo libre, gráficos o esquemas a cualquier pregunta.' },
      { title: 'Importar desde DOCX', text: 'Convierte un banco de preguntas que ya existe en Word en una evaluación lista para publicar.' },
      { title: 'Reglas del examen', text: 'Duración, número de intentos, orden aleatorio y cuándo se muestra el resultado.' }
    ],
    replaces: ['Exámenes fotocopiados', 'Corrección manual hoja por hoja', 'Bancos de preguntas dispersos']
  },
  {
    slug: 'klassia-en-vivo',
    name: 'Klassia en vivo',
    eyebrow: 'Participación',
    headline: 'El repaso que la clase sí quiere hacer.',
    tagline: 'Sesiones con PIN, respuestas en vivo y tabla de posiciones.',
    summary:
      'Convierte un repaso en una sesión participativa: los alumnos entran con un PIN desde su celular, responden contra reloj y la clase ve los resultados al instante. Sirve para cerrar un tema sin que la energía se caiga.',
    bullets: ['Acceso por PIN', 'Resultados al instante', 'Tabla de posiciones'],
    shot: 'klassia-en-vivo',
    shotAlt: 'Sesión de Klassia en vivo proyectada con PIN de acceso, pregunta, tabla de posiciones y respuestas en tiempo real',
    shotWidth: 2960,
    shotHeight: 1352,
    tone: 'coral',
    icon: 'spark',
    capabilities: [
      { title: 'Entrada sin cuenta nueva', text: 'El alumno entra con el PIN proyectado en la pizarra desde cualquier celular.' },
      { title: 'Respuestas en vivo', text: 'El docente ve cuántos respondieron y qué opción eligieron antes de explicar.' },
      { title: 'Tabla de posiciones', text: 'El puntaje acumulado mantiene la atención del grupo durante todo el repaso.' },
      { title: 'Preguntas reutilizables', text: 'Las preguntas del repaso parten del mismo banco que usas en las evaluaciones.' }
    ],
    replaces: ['Repasos a mano alzada', 'Herramientas de juego separadas', 'Participación difícil de medir']
  },
  {
    slug: 'reportes',
    name: 'Reportes',
    eyebrow: 'Seguimiento',
    headline: 'Saber cómo va el ciclo sin pedir un solo archivo.',
    tagline: 'Notas, asistencia y entregas en una misma lectura.',
    summary:
      'Promedios por curso y por grupo, evolución a lo largo del ciclo, distribución de notas y alumnos que necesitan seguimiento. Coordinación deja de reconstruir la información para poder tomar decisiones.',
    bullets: ['Evolución por curso', 'Ranking por grupo', 'Alumnos en riesgo'],
    shot: 'reportes',
    shotAlt: 'Reportes académicos de Klassia con promedio general, evolución por curso, distribución de notas y ranking por grupo',
    shotWidth: 2960,
    shotHeight: 1256,
    tone: 'sky',
    icon: 'chart',
    capabilities: [
      { title: 'Evolución del ciclo', text: 'Mira cómo se mueve el promedio de cada curso semana a semana, no solo al final.' },
      { title: 'Distribución de notas', text: 'Entiende cuántos alumnos están sobresalientes, en proceso o en riesgo de un vistazo.' },
      { title: 'Comparación entre grupos', text: 'Ranking por grupo para ver dónde hace falta reforzar y dónde el método está funcionando.' },
      { title: 'Exportación', text: 'Lleva el corte que necesites a un archivo cuando haya que presentarlo fuera del sistema.' }
    ],
    replaces: ['Consolidados manuales', 'Reportes que llegan tarde', 'Decisiones por intuición']
  }
];

export const moduleBySlug = (slug: string): Module | undefined =>
  modules.find((item) => item.slug === slug);
