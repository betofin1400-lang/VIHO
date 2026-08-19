export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  options?: string[];
  timestamp: Date;
}

export const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  sender: 'agent',
  text: '¡Hola! Soy el asistente de VIHO Arquitectura. 🏠\n¿Qué tipo de proyecto tienes en mente?',
  options: ['Cocinas', 'Baños', 'Estudios', 'Closets'],
  timestamp: new Date(),
};

export const MOCK_FLOW: Record<string, { text: string; options?: string[] }> = {
  Cocinas: {
    text: '¡Genial! ¿Qué tipología de cocina deseas?',
    options: ['Lineal', 'En L', 'Con Península', 'En Isla'],
  },
  Baños: {
    text: 'Perfecto. ¿Qué tipo de baño necesitas?',
    options: ['Baño completo', 'Medio baño', 'Baño principal', 'Baño infantil'],
  },
  Estudios: {
    text: '¡Excelente! ¿Qué tipo de espacio de trabajo necesitas?',
    options: ['Home Office', 'Estudio creativo', 'Oficina ejecutiva', 'Espacio mixto'],
  },
  Closets: {
    text: '¡Bien! ¿Qué tipo de closet buscas?',
    options: ['Closet empotrado', 'Walk-in closet', 'Walk-in closet premium', 'Closet abierto'],
  },
  Lineal: {
    text: '¿Cuál es el área aproximada en m²?',
  },
  'En L': {
    text: '¿Cuál es el área aproximada en m²?',
  },
  'Con Península': {
    text: '¿Cuál es el área aproximada en m²?',
  },
  'En Isla': {
    text: '¿Cuál es el área aproximada en m²?',
  },
  default_measure: {
    text: '¿Qué tendencia arquitectónica te gustaría?',
    options: ['Moderna', 'Minimalista', 'Clásica', 'Industrial'],
  },
  Moderna: {
    text: '¿Cuál es tu presupuesto estimado?',
    options: ['< $10M', '$10-15M', '$15-20M', '> $20M'],
  },
  Minimalista: {
    text: '¿Cuál es tu presupuesto estimado?',
    options: ['< $10M', '$10-15M', '$15-20M', '> $20M'],
  },
  Clásica: {
    text: '¿Cuál es tu presupuesto estimado?',
    options: ['< $10M', '$10-15M', '$15-20M', '> $20M'],
  },
  Industrial: {
    text: '¿Cuál es tu presupuesto estimado?',
    options: ['< $10M', '$10-15M', '$15-20M', '> $20M'],
  },
  '< $10M': {
    text: '¡Perfecto! Basado en tu selección, el rango estimado es:\n\n$8.500.000 — $11.500.000\n\n* Cotización referencial. Sujeta a visita técnica.\n\n¿Te gustaría agendar una visita técnica con nuestro equipo?',
    options: ['Sí, agendar', 'Más tarde'],
  },
  '$10-15M': {
    text: '¡Excelente! Basado en tu selección, el rango estimado es:\n\n$10.800.000 — $14.600.000\n\n* Cotización referencial. Sujeta a visita técnica.\n\n¿Te gustaría agendar una visita técnica con nuestro equipo?',
    options: ['Sí, agendar', 'Más tarde'],
  },
  '$15-20M': {
    text: '¡Muy bien! Basado en tu selección, el rango estimado es:\n\n$14.200.000 — $19.100.000\n\n* Cotización referencial. Sujeta a visita técnica.\n\n¿Te gustaría agendar una visita técnica con nuestro equipo?',
    options: ['Sí, agendar', 'Más tarde'],
  },
  '> $20M': {
    text: '¡Impresionante! Basado en tu selección, el rango estimado es:\n\n$18.500.000 — $24.800.000\n\n* Cotización referencial. Sujeta a visita técnica.\n\n¿Te gustaría agendar una visita técnica con nuestro equipo?',
    options: ['Sí, agendar', 'Más tarde'],
  },
  'Sí, agendar': {
    text: '¡Genial! Para agendar tu visita técnica, por favor déjame tus datos:\n\n¿Cuál es tu nombre completo?',
  },
  'Más tarde': {
    text: '¡Sin problema! Cuando quieras puedes escribirnos al WhatsApp o agendar directamente.\n\n📱 +57 XXX XXX XXXX\n📧 sebastianvizcaino@vihoarquitectura.co',
    options: ['Volver al inicio'],
  },
  'Volver al inicio': {
    text: '¡Hola! Soy el asistente de VIHO Arquitectura. 🏠\n¿Qué tipo de proyecto tienes en mente?',
    options: ['Cocinas', 'Baños', 'Estudios', 'Closets'],
  },
};
