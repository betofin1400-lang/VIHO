# HU-02 · Agente Pre-Cotizador VIHO Arquitectura

> **Fuente:** Cotización al cliente + VIHO_data.xlsx + patrones front/03 y back/02
> **Prioridad:** Alta · **Módulo:** Frontend (chat UI) + Backend (API motor de cálculo)

## Historia

Como **potencial cliente de VIHO Arquitectura** quiero **interactuar con un asistente inteligente que me guíe en la selección de materiales y me dé un estimado de precio** para **saber si el proyecto se ajusta a mi presupuesto antes de agendar una visita técnica**.

## Contexto

El corazón del producto es un agente conversacional que:
1. Pregunta en orden: tipo → tipología → medidas → materiales → herrajes → contacto
2. Calcula un **rango de precio** (nunca precio fijo)
3. Genera una cotización referencial
4. Captura el lead y lo envía por correo

**Decisiones tomadas:**
- **Modelo de IA:** Gemini 2.5 Flash (Google AI Studio) — vision + documentos nativos, 1M contexto, Free Tier 1,500 RPD. NOTA: gemini-2.0-flash fue deprecado por Google (404); gemini-3.6-flash experimenta alta demanda (503 frecuentes). 2.5-flash es el más estable.
- **UI del agente:** Dos opciones implementadas:
  - **Opción A:** Botón flotante (FAB) que abre chat tipo modal → `/agente`
  - **Opción B:** Interfaz directa (pantalla completa dentro del sitio) → `/agente-directo`

**Estado actual:** Integración con Gemini 2.5 Flash implementada. API route funcional. Prototipos con respuestas reales del agente. Welcome message filtrado del historial (Gemini requiere que el primer mensaje sea `user`).

## Criterios de aceptación

**CA-1 · Opción A — Chat Flotante (FAB + Modal)**
- **Dado** que un usuario está en cualquier sección de la landing
- **Cuando** hace scroll o está navegando
- **Entonces** ve un botón flotante (FAB) en la esquina inferior derecha
- **Cuando** hace clic en el FAB
- **Entonces** se abre un modal de chat con:
  - Header con logo VIHO y nombre "Asistente VIHO"
  - Botón de cerrar (X)
  - Área de mensajes con burbujas (usuario a la derecha, agente a la izquierda)
  - Input de texto con botón de enviar
  - Mensaje de bienvenida automático del agente
  - El FAB muestra un indicador de "nuevo mensaje" cuando el chat está cerrado

**CA-2 · Opción B — Interfaz Directa (Pantalla Completa)**
- **Dado** que un usuario quiere cotizar
- **Cuando** llega a la interfaz del agente (desde un botón "Cotizar" o ruta dedicada)
- **Entonces** ve una pantalla completa con:
  - Panel lateral izquierdo con resumen del proyecto (placeholder)
  - Área principal de chat con burbujas
  - Input de texto fijo en la parte inferior
  - Header con logo VIHO y botón de volver

**CA-3 · Mensajes de bienvenida (ambas opciones)**
- **Dado** que el usuario abre el chat
- **Cuando** carga la interfaz
- **Entonces** el agente muestra automáticamente:
  ```
  ¡Hola! Soy el asistente de VIHO Arquitectura. 🏠
  ¿Qué tipo de proyecto tienes en mente?
  
  [Cocinas] [Baños] [Estudios] [Closets]
  ```

**CA-4 · Burbujas de opciones (ambas opciones)**
- **Dado** que el agente pregunta por tipo de proyecto, tipología, materiales, etc.
- **Cuando** muestra las opciones
- **Entonces** las opciones se muestran como botones clickeables dentro del chat (no como texto libre)

**CA-5 · Prototype mode (ambas opciones)**
- **Dado** que es un prototipo visual
- **Cuando** el usuario selecciona una opción
- **Entonces** el agente responde con un mensaje predefinido (mock), no con cálculos reales
- **Y** el flujo simula: tipo → tipología → medidas → materiales → cierre

**CA-6 · Responsive**
- **Dado** que el usuario accede desde móvil
- **Cuando** usa cualquiera de las dos opciones
- **Entonces** el chat se adapta al tamaño de pantalla (modal full-screen en móvil)

## Decisiones de diseño

### Modelo de IA (PENDIENTE)
Se requiere un modelo con capacidades multimodales para:
- Ver imágenes de espacios que el usuario suba
- Leer documentos (planos, cotizaciones anteriores)

**Tabla comparativa actualizada (agosto 2026):**

#### Tier Económico (recomendado para arrancar)

| Modelo | Input/1M | Output/1M | Contexto | Vision | Docs | Velocidad | Notas |
|--------|----------|-----------|----------|--------|------|-----------|-------|
| **GPT-4o-mini** | $0.15 | $0.60 | 128K | ✅ | ❌ limitado | ~91 tok/s | Más barato de OpenAI, vision básico |
| **Gemini 2.5 Flash** | $0.30 | $2.50 | 1M | ✅ | ✅ PDF nativo | Rápido | Mejor precio/contexto de Google |
| **Gemini 3 Flash** | $0.50 | $3.00 | 1M | ✅ | ✅ | Rápido | Gemini 3 más barato |
| **Claude 3.5 Haiku** | $0.80 | $4.00 | 200K | ✅ | ✅ | Rápido | Buen español, vision + tools |

#### Tier Medio

| Modelo | Input/1M | Output/1M | Contexto | Vision | Docs | Notas |
|--------|----------|-----------|----------|--------|------|-------|
| **Gemini 3.5 Flash** | $1.50 | $9.00 | 1M | ✅ | ✅ | GA estable, production-ready |
| **Gemini 3.6 Flash** | $1.50 | $7.50 | 1M | ✅ | ✅ | Más eficiente que 3.5 Flash |
| **Claude Sonnet 5** | $2.00 | $10.00 | 1M | ✅ | ✅ nativo | Intro price hasta 31/ago, luego $3/$15 |

#### Tier Premium (solo si se necesita razonamiento complejo)

| Modelo | Input/1M | Output/1M | Contexto | Vision | Docs | Notas |
|--------|----------|-----------|----------|--------|------|-------|
| **GPT-4o** | $2.50 | $10.00 | 128K | ✅ | ✅ tools | Referencia del cliente |
| **Gemini 2.5 Pro** | $1.25 | $10.00 | 2M | ✅ | ✅ | Contexto enorme |
| **Claude Opus 5** | $5.00 | $25.00 | 200K | ✅ | ✅ | Máxima calidad, caro |

**Costo estimado por conversación (~500 tokens in + ~300 tokens out):**

| Modelo | Costo por conversación | Costo 1000 conversaciones |
|--------|----------------------|--------------------------|
| GPT-4o-mini | ~$0.0003 | ~$0.25 |
| Gemini 2.5 Flash | ~$0.001 | ~$0.90 |
| Claude 3.5 Haiku | ~$0.002 | ~$1.60 |
| GPT-4o | ~$0.004 | ~$4.25 |

**Recomendación:** Arrancar con **Gemini 2.5 Flash** o **GPT-4o-mini** para el prototipo. Ambos tienen vision a bajo costo. El prototype no necesita modelo real.

### UI (DOS OPCIONES A PROTOTIPAR)
1. **FAB + Modal** — No interrumpe la navegación, el usuario lo abre cuando quiere
2. **Interfaz directa** — Experiencia inmersiva, ideal para mobile-first

### Flujo del prototipo (mock)
```
1. Agente: "¿Qué tipo de proyecto tienes en mente?"
   [Cocinas] [Baños] [Estudios] [Closets]
   
2. Usuario: [Cocinas]
   Agente: "¿Qué tipología de cocina deseas?"
   [Lineal] [En L] [Con Península] [En Isla]
   
3. Usuario: [En L]
   Agente: "¿Cuál es el área aproximada en m²?"
   [Input numérico]
   
4. Usuario: [12 m²]
   Agente: "¿Qué tendencia arquitectónica te gustaría?"
   [Moderna] [Minimalista] [Clásica] [Industrial]
   
5. Usuario: [Moderna]
   Agente: "¿Cuál es tu presupuesto estimado?"
   [<$10M] [$10-15M] [$15-20M] [>$20M]
   
6. Usuario: [$10-15M]
   Agente: "¡Perfecto! Basado en tu selección, el rango estimado es:
   $XX.XXX.XXX — $YY.YYY.YYY
   * Cotización referencial. Sujeta a visita técnica.
   
   ¿Te gustaría agendar una visita técnica?"
   [Sí, agendar] [Más tarde]
```

## Reglas de negocio

1. El agente **nunca** da precio fijo. Siempre rango mín–máx.
2. El estimado se marca como **referencial y sujeto a visita técnica**.
3. El tono es **cercano y minimalista** (estilo VIHO).
4. Las preguntas van en orden: tipo → tipología → medidas → materiales → herrajes → contacto.
5. Si el usuario se sale del flujo, el agente redirige suavemente.
6. La captura del lead incluye **autorización de tratamiento de datos (Ley 1581)**.
7. El lead se envía por correo al cliente.
8. Compromisos que el agente debe mencionar:
   - Visita técnica: máximo 3 días hábiles
   - Diseño y cotización: máximo 7 días hábiles
   - Ajustes: máximo 48 horas hábiles
   - Entrega: hasta 40 días calendario

## Fuera de alcance (este HU)

- Motor de cálculo real (será HU-03)
- Envío de correos
- Base de datos de leads
- Integración con Google Drive
- Gestión de sesiones/usuarios
- Vision de imágenes/documentos (futuro)

## Entregables de este HU

1. **Prototipo Opción A** (FAB + Modal) — ruta `/agente` — ✅ Listo
2. **Prototipo Opción B** (Interfaz directa) — ruta `/agente-directo` — ✅ Listo
3. **API Route** `/api/chat` con Gemini 2.0 Flash — ✅ Listo
4. **Hook `useChat`** compartido entre ambos prototipos — ✅ Listo
5. **System prompt** del agente con reglas de negocio — ✅ Listo
6. **Documentación** en `docs/back/04-integracion-gemini.md` — ✅ Listo
