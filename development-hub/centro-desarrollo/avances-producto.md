# Bitácora — `producto`

**Área:** Agente Pre-cotizador VIHO (formulario + motor de cálculo + landing)

> Proyección legible de `.work/producto/*/progreso.md`. **Generada por `render.py`**
> (no editar a mano; el próximo render la pisa). Versión visual: `avances-producto.html`.

**Insumos:** `.work/producto/*/progreso.md` + `_intro.md`

Volver al [Panorama de avances](avances.html).

## Resumen

# Workspace: Producto

Este es el único workspace del proyecto VIHO Arquitectura.

**Producto:** Agente pre-cotizador de cocinas + landing page para WhatsApp.

## Qué vive aquí

Todo el trabajo de desarrollo se organiza bajo este workspace como items:
- `feat-*`: funcionalidades nuevas (motor de cálculo, agente IA, etc.)
- `change-*`: mejoras o ajustes a funcionalidad existente
- `fix-*`: correcciones de bugs

## Cómo empezar

1. Crea una rama desde `master` (o desde el ambiente del que se dependa)
2. Documenta los requisitos en `<item>/docs/`
3. Usa `/viho-forjar-skill producto/<item>` para generar el playbook
4. Desarrolla fase por fase con `/viho-desarrollar producto/<item>`

## Stack

- **Frontend:** Next.js 16 + React 19 + Tailwind 4 + shadcn/ui
- **Backend:** Next.js API routes
- **Integración:** Google Drive API (service account)
- **Despliegue:** Vercel

## Patrones relevantes

- `docs/front/01-paleta-marca-viho.md` — colores y sistema de diseño
- `docs/front/03-flujo-conversacion-agente.md` — flujo del agente
- `docs/back/02-motor-calculo-cotizacion.md` — motor de cálculo

## Estado de funcionalidades

| Items | Pendientes | En curso | Completadas | Avance % (CAs) |
|-------|------------|----------|-------------|----------------|
| 1 | 0 | 1 | 0 | 0% (0/0) |

| Item | Tipo | Autor | Fase | CAs | % | Confianza | Estado |
|------|------|-------|------|-----|---|-----------|--------|
| `feat-landing-page` |  |  | 0/5 | 0/0 | 0% | auto | en-curso |

## Detalle por funcionalidad

### `feat-landing-page`

**Estado actual**

| Fase | Estado | % |
|---|---|---|
| Análisis | ✅ Completada | 100% |
| Diseño | ⬜ Pendiente | 0% |
| Implementación | ⬜ Pendiente | 0% |
| Verificación | ⬜ Pendiente | 0% |
| Cierre | ⬜ Pendiente | 0% |

**Progreso total:** 20%

**Artefactos generados**

- [x] `docs/HU-01-landing-page.md` — Historia de usuario principal (10 CA)
- [x] `docs/_contexto-negocio.md` — Contexto y reglas del negocio
- [x] `contexto-tecnico.md` — Patrones seleccionados
- [x] `skills/SKILL.md` — Playbook del item
- [x] `casos-prueba.md` — Suite de casos de prueba (38 casos)
- [x] `progreso.md` — Estado del item
- [ ] `validacion-requisitos.md` — Prevalidación de requisitos
- [ ] `analisis.md` — Análisis detallado
- [ ] `plan.md` — Plan de implementación
- [ ] `resultado.md` — Resultado de la implementación
- [ ] `verificacion.md` — Evidencia de verificación

**Notas**

- 2026-08-19: Fase de análisis completada. HU con 10 CA, 38 casos de prueba, playbook generado.
- **PENDIENTE:** 8 preguntas abiertas requieren respuesta del cliente antes de Fase 2.

## Log de implementación

_Sin registro de actividad todavía._

