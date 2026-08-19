# Índice maestro — Patrones técnicos de VIHO Arquitectura

> **Qué es esto.** El **selector** de la documentación técnica del proyecto. Indexa todo el set de
> patrones con una descripción **«Cargar cuando…»** por documento, para que —persona o agente— cargue
> **solo** los documentos que la tarea necesita, sin reinventar lo que ya existe.
>
> **Cómo usarlo (agente).** 1) Identifica qué toca tu tarea. 2) Lee la columna «Cargar cuando…» y
> carga los **3-8** documentos cuyo trigger empareja, **cubriendo ambos lados de cada costura**.
> 3) Para el panorama, entra primero por [`arquitectura-general.md`](arquitectura-general.md).
> 4) De cada documento cargado, extrae su bloque «Fuente de la verdad»: esas son tus anclas de código.
>
> **Calibración.** Mejor 5 patrones que aplican de verdad que 15 «por si acaso». Si un trigger no
> empareja, no lo incluyas.
>
> **Autoridad.** Ante divergencia entre este set y cualquier documentación anterior del repositorio,
> **gana este set**: sus afirmaciones están ancladas a rutas verificadas contra la rama principal.

---

## 1. Navegación rápida por objetivo

| Quiero… | Empieza por |
|---|---|
| Entender el ecosistema completo | [`arquitectura-general.md`](arquitectura-general.md) |
| Cambiar colores, tipografía o estilos de la marca | front 01 → arquitectura §3 |
| Implementar el motor de cálculo de cotizaciones | back 02 → back 04 |
| Modificar el wizard de onboarding (pasos, campos) | front 03 → front 01 |
| Configurar la integración con Google Drive | back 05 |
| Entender las reglas de negocio del agente | back 04 → arquitectura §7 |
| Agregar un nuevo tipo de proyecto o tipología | back 04 + front 03 |
| Integrar Gemini 2.5 Flash para el chat del agente | back 04 (Gemini) → front 03 (flujo) |

## 2. Front — `docs/front/`

### UI / Marca

| Doc | Tema | Cargar cuando… |
|-----|------|----------------|
| [01](front/01-paleta-marca-viho.md) | Paleta de marca VIHO y sistema de diseño | Cambies colores, crees componentes nuevos, modifiques `globals.css`, o verifiques contraste de la UI. Tocar cualquier referencia a `[#0E2B1D]`, `[#DEA71A]`, `[#E1CB82]`, `[#ADC2AF]`, `[#CCCBCD]`. |
| [03](front/03-flujo-conversacion-agente.md) | Flujo de conversación del agente pre-cotizador | Implementes el chat del agente, modifiques el orden de preguntas, o cambies el flujo de captura de leads. Toques `page.tsx` paso 3 o crees componentes del agente. |

## 3. Back — `docs/back/`

### Motor de cálculo / Cotizaciones

| Doc | Tema | Cargar cuando… |
|-----|------|----------------|
| [02](back/02-motor-calculo-cotizacion.md) | Estructura de cotización y motor de cálculo | Crees o modifiques la API de cálculo de precios, cambies las reglas de negocio, o agregues categorías de materiales. Toques `src/app/api/` o crees endpoints nuevos de cálculo. |
| [04](back/04-integracion-gemini.md) | Integración Gemini 2.5 Flash para agente | Implementes el chat del agente, modifiques el system prompt, cambies el modelo de IA, o agregues capacidades de vision/documentos. Toques `src/app/api/chat/` o componentes del agente. |

## 4. Mapa de cruces entre slices

| Costura | Front | Back |
|---|---|---|
| Wizard → Google Drive | front 03 (flujo) | back 02 (motor) + back 05 (Drive) |
| Paleta de marca → UI | front 01 (colores) | — |
| Reglas de negocio → Cálculo | front 03 (preguntas) | back 02 (motor) + back 04 (reglas) |
| Lead capture → Correo | front 03 (contacto) | back 05 (Drive email) |

## 5. Convenciones del set

- `NN` es identificador estable, append-only. **Jamás se renumera.**
- `↳` marca un **micro-patrón** extraído de un documento padre (que lo enlaza y es enlazado).
- Cada patrón abre con su bloque **«Fuente de la verdad»** (anclas de código, estado, espécimen).
- Un patrón entra a `docs/` **con su fila en este índice en el mismo cambio**: un patrón sin trigger
  es invisible y no se carga nunca.
- Los conteos de este archivo **los deriva el script**, no se escriben a mano.

## 6. Decisiones (ADR)

| ADR | Decisión | Cargar cuando… |
|---|---|---|
| — | Pendiente: primera decisión documentada | — |
