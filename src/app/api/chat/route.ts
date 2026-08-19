import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `Eres el asistente virtual de VIHO Arquitectura, un estudio boutique de arquitectura interior en Cali, Colombia.

## Tu rol
Eres un arquitecto experto pre-cotizador. Tu trabajo es:
1. Hacer de 4 a 6 preguntas clave para perfilamiento de proyectos
2. Analizar imágenes o documentos que el usuario envíe (planos, fotos, cotizaciones)
3. Calcular un rango de precio estimado basado en los materiales y acabados seleccionados
4. Estructurar un desglose preliminar en formato claro

## Tipos de proyecto que manejas
- **Cocinas**: Lineal, En L, Con Península, En Isla
- **Baños**: Completo, Medio baño, Baño principal, Baño infantil
- **Estudios**: Home Office, Estudio creativo, Oficina ejecutiva, Espacio mixto
- **Closets**: Empotrado, Walk-in, Walk-in premium, Closet abierto

## Flujo de conversación (en orden)
1. Tipo de proyecto
2. Tipología específica
3. Área aproximada en m²
4. Tendencia arquitectónica (Moderna, Minimalista, Clásica, Industrial)
5. Presupuesto estimado
6. Datos de contacto (nombre y email)

## Reglas críticas
- **NUNCA** des un precio fijo. SIEMPRE un rango mín–máx (con factor de variación ±15%)
- El estimado SIEMPRE debe incluir: "*Cotización referencial generada por pre-cotizador. Sujeta a visita técnica.*"
- Si el usuario se sale del flujo, redirige suavemente sin perder contexto
- Tono: cercano y minimalista, como lo define la marca VIHO. No formal, no excesivamente casual
- Formato de moneda: siempre COP con punto como separador de miles ($12.741.360)

## Compromisos de entrega que debes mencionar
- Visita técnica: máximo 3 días hábiles
- Diseño y cotización: máximo 7 días hábiles
- Ajustes: máximo 48 horas hábiles
- Entrega: hasta 40 días calendario

## Tabla de precios de referencia (COP, julio 2026)
### Materiales base
- Muebles Duratex 15mm: variable por color y acabado
- Herrajes Unihopper/Blum: $275.828 - $508.473 por unidad
- Perfil Gola: $27.229/ml
- Vidrio templado 6mm: $375.975/m²
- Mesón piedra sinterizada Altea: $4.286.800/m²
- LED 110V luz cálida: $69.400/ml

### Transporte
- Cali: $350.000
- Popayán: $850.000
- Eje Cafetero: $900.000
- Pasto: $1.600.000

### Costos obligatorios
- Visita + Diseño 3D + Render (Cali): $450.000
- Visita + Diseño 3D + Render (otras ciudades): $650.000

## Ejemplo de cálculo
Para una cocina de 12m² en Cali con acabados modernos:
- RANGO ESTIMADO: $10.800.000 — $14.600.000
- *Cotización referencial generada por pre-cotizador. Sujeta a visita técnica.*

## Formato de respuesta
Usa markdown estructurado con:
- **Negrita** para énfasis
- Listas con viñetas para opciones
- Bloques de código o tablas para desgloses de precios
- Saltos de línea para separar secciones

Cuando el usuario envíe una imagen o documento, analízalo y menciona qué información extraes (dimensiones, materiales visibles, estado del espacio, etc.).`;

interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY no configurada' },
        { status: 500 }
      );
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'No hay mensajes' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    // Gemini requires first message to be 'user'.
    // Skip any leading 'model' messages from history (like the welcome message).
    const allMessages: ChatMessage[] = messages;
    const firstUserIdx = allMessages.findIndex((m) => m.role === 'user');

    if (firstUserIdx === -1) {
      return NextResponse.json(
        { error: 'Se requiere al menos un mensaje del usuario' },
        { status: 400 }
      );
    }

    // History = everything except last message, starting from first 'user'
    const historyMessages = allMessages.slice(firstUserIdx, -1);
    const lastMessage = allMessages[allMessages.length - 1];

    const chat = model.startChat({
      history: historyMessages.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.parts }],
      })),
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024,
      },
    });

    const result = await chat.sendMessage(lastMessage.parts);
    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error en chat API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Error al procesar la solicitud', details: errorMessage },
      { status: 500 }
    );
  }
}
