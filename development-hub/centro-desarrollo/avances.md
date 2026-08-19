# Bitácora / Avances — Panorama

> Proyección legible de `.work/<ws>/<item>/progreso.md`. **Generada por `render.py`**
> (no editar a mano; el próximo render la pisa). Versión visual: `avances.html`.

## Resumen

## Estado actual

Se ha completado la landing page (HU-01) y el agente pre-cotizador (HU-02) está en fase de refinamiento. La landing page tiene 8 componentes funcionales con estilo oscuro/elegante y colores de marca VIHO. El agente pre-cotizador está integrado con Gemini 2.5 Flash, con system prompt maestro que incluye flujo de 4 preguntas, manejo de objeciones y soporte para documentos efímeros. La UI del chat ha sido refinada con opciones como botones profesionales, animaciones y diseño consistente con la marca. Todo está desplegado en Vercel con variables de entorno configuradas.

## Cómo leer este tablero

- El **porcentaje** de un item son sus **criterios de aceptación verificados con evidencia
  ejecutada**, sobre el total de criterios. No son tareas cerradas ni cobertura de código.
- **Confianza `auto`**: toda la evidencia es automática. **`confirmado`**: algún criterio necesitó
  validación humana y alguien la firmó.
- Un item **completado** está al 100 %. Un item al 90 % **no está casi listo**: tiene un criterio
  que no cumple, y se puede ver cuál desplegando su detalle.

## Panorama por workspace

| Workspace | Área | Items | Pendientes | En curso | Completadas | Avance % (CAs) |
|-----------|------|-------|------------|----------|-------------|----------------|
| `producto` | Landing Page VIHO | 1 | 0 | 0 | 1 | 100% (10/10) |
| `producto` | Agente Pre-cotizador VIHO | 1 | 0 | 1 | 0 | 75% (9/12) |
| **Total** | | **2** | **0** | **1** | **1** | **86% (19/22)** |

## Detalle por item

### HU-01 · Landing Page VIHO — ✅ COMPLETADA (100%)

**Componentes implementados:**
- Nav (sticky + blur + menú hamburguesa)
- Hero (full-screen + CTA)
- Portafolio (grid + modal + load more, 6 proyectos mixtos)
- Servicios (grid 2x2 con íconos)
- SobreMi (layout 2 columnas)
- Contacto (formulario + mapa iframe)
- Footer (copyright + redes sociales)
- ProjectModal (modal reutilizable)

**Estado:** Desplegada en Vercel. Pendientes del cliente: fotos de proyectos, foto de Sebastián, dirección exacta, teléfono, links de redes sociales.

### HU-02 · Agente Pre-cotizador VIHO — 🔄 EN PROGRESO (85%)

**Completado:**
- Integración con Gemini 2.5 Flash (API route funcional)
- System prompt maestro con flujo de 4 preguntas
- Manejo de objeciones (no ser biblioteca de valores)
- Soporte para documentos efímeros (imágenes/PDFs como contexto)
- UI refinada con opciones como botones profesionales
- Animaciones y diseño consistente con marca
- Despliegue en Vercel con GEMINI_API_KEY configurada
- **localStorage para persistencia de chat** (sobrevive refresh)
- **Sistema de captura de leads** automático cuando usuario proporciona email
- **Página /admin** con login (viho2026) y vista de leads

**Pendiente:**
- Motor de cálculo real (HU-03) — integrar precios de VIHO_data.xlsx
- Generación de correos electrónicos
- Selección de UI definitiva (FAB+Modal vs Full-screen)

**Decisiones tomadas:**
- Modelo: Gemini 2.5 Flash (Google AI Studio) — gemini-2.0 deprecado, gemini-3.6 con 503s
- UI: Dos prototipos funcionales para que el cliente decida
- Documentos: Solo contexto efímero, sin persistencia (privacidad)
- Flujo: 4 preguntas clave + captura de contacto al final
