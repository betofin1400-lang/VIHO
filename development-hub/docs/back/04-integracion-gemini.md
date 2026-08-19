---
titulo: "Integración Gemini 2.5 Flash para agente pre-cotizador"
tipo: "patrón"
rol: "desarrollador"
proyecto: "viho"
tags: [gemini, ia, chat, api, integracion]
actualizado: "2026-08-19"
fuente: "Google AI Studio + documentación Gemini"
---

# Integración Gemini 2.5 Flash para agente pre-cotizador

## Fuente de la verdad
- Google AI Studio: https://aistudio.google.com
- SDK: `@google/generative-ai` (npm)
- Modelo: `gemini-2.5-flash`

> **NOTA:** `gemini-2.0-flash` fue deprecado por Google (retorna 404).
> `gemini-3.6-flash` opera bajo alta demanda con errores 503 frecuentes.
> `gemini-2.5-flash` es el modelo más estable actualmente.

## Especificaciones del modelo

| Característica | Valor |
|----------------|-------|
| Modelo | `gemini-2.5-flash` |
| Contexto | 1,000,000 tokens |
| Vision | ✅ Nativo (imágenes + PDF) |
| Documentos | ✅ PDF nativo via File API |
| Free Tier | 1,500 RPD, 15 RPM |
| Temperatura recomendada | 0.2 (respuestas precisas) |

## Configuración

### API Key
1. Ir a https://aistudio.google.com/apikey
2. Crear API key (no requiere tarjeta de crédito)
3. Guardar en `.env.local` como `GEMINI_API_KEY`

### Dependencia
```bash
npm install @google/generative-ai
```

## Arquitectura de integración

```
Frontend (Chat UI)
    ↓ POST /api/chat
API Route (Next.js)
    ↓ GoogleGenerativeAI
Gemini 2.0 Flash
    ↓ Respuesta
Frontend (renderiza respuesta)
```

## System Prompt del agente

El system prompt define:
1. **Rol**: Arquitecto experto pre-cotizador
2. **Tipos de proyecto**: Cocinas, Baños, Estudios, Closets
3. **Flujo**: tipo → tipología → área → tendencia → presupuesto → contacto
4. **Reglas críticas**: Nunca precio fijo, siempre rango ±15%
5. **Tabla de precios**: Materiales base, transporte, costos obligatorios
6. **Compromisos de entrega**: 3 días visita, 7 días diseño, 40 días entrega

## Código de referencia

### API Route (`src/app/api/chat/route.ts`)
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  systemInstruction: SYSTEM_PROMPT,
});

const chat = model.startChat({
  history: [...],
  generationConfig: {
    temperature: 0.2,
    maxOutputTokens: 1024,
  },
});

const result = await chat.sendMessage(userMessage);
```

### Hook del chat (`src/app/components/agent/useChat.ts`)
```typescript
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text: string) => {
    // Agregar mensaje del usuario
    // Llamar a /api/chat
    // Agregar respuesta del agente
  };

  return { messages, isLoading, sendMessage };
}
```

## Configuración de producción

### Free Tier (desarrollo)
- 1,500 peticiones/día
- 15 peticiones/minuto
- Datos pueden ser usados por Google para entrenamiento

### Pay-as-you-go (producción)
- Misma tarifa: $0.30/$2.50 por 1M tokens
- Datos protegidos al 100%
- Vincular tarjeta de crédito

## Rutas disponibles

| Ruta | Descripción |
|------|-------------|
| `/agente` | FAB + Modal (chat flotante) |
| `/agente-directo` | Interfaz pantalla completa |
| `/api/chat` | API endpoint para Gemini |

## Reglas para el desarrollador

1. **NUNCA** exponer la API key en el frontend
2. **SIEMPRE** usar temperature 0.2 para respuestas consistentes
3. **VALIDAR** que GEMINI_API_KEY esté configurada antes de llamar
4. **MANEJAR** errores gracefully (mostrar mensaje amigable)
5. **CACHÉ** no implementado aún — futuro para optimizar costos

## Dónde NO se cumple
- La integración con vision (imágenes) aún no está implementada en el frontend
- La captura de leads no está conectada a base de datos
- El envío de correos no está implementado

## Reglas al cierre
- [ ] API key configurada en `.env.local`
- [ ] SDK instalado (`@google/generative-ai`)
- [ ] API route funcional (`/api/chat`)
- [ ] Hook `useChat` conectado a ambos prototipos
- [ ] Loading states implementados
- [ ] Error handling funcional
