# config-proyecto — Parámetros VIHO Arquitectura

> **Qué es esto.** La **única fuente de verdad** de los parámetros del proyecto que consumen el meta
> skill (`/viho-forjar-skill`) y todo skill especializado que este genere. Aquí se centralizan rutas,
> comandos, especialistas y políticas para que ningún skill los repita ni los invente. Si algo del
> stack cambia, se edita **aquí** y todos los skills generados a futuro lo heredan.

## 1. Layout de repos (la ruta absoluta es VARIABLE — descubrir por marcador)

Los skills del centro pueden estar instalados **globalmente** (symlink en `~/.claude/skills/`, ver
`/viho-centro-instalar`), así que el **cwd puede NO ser el hub**. Por eso las rutas se resuelven **por un
marcador**, nunca por nombre de carpeta ni por prefijo absoluto:

- **Marcador:** `.centro-desarrollo.json` en la raíz de `<HUB>`.
- **`<HUB>`** = la carpeta que **contiene el marcador**. Contiene `docs/`, `.work/`, `.claude/`,
  `centro-desarrollo/`, `resources/`.
- **`<ROOT>`** = raíz del código, resuelta por `codigo.root_rel` (≈ `../`, la carpeta **padre** del
  `<HUB>`). Contiene las carpetas de código, cuyos **nombres los da el marcador** (`codigo.repos`).
- **Algoritmo de descubrimiento** (todo skill lo aplica):
  1. Desde el cwd, **camina hacia arriba** buscando `.centro-desarrollo.json`.
  2. Si no aparece, búscalo en una carpeta hermana o hija típica (`./development-hub/`,
     `../development-hub/`, `../*/`) — cualquier carpeta con el marcador, **sin asumir el nombre**
     `development-hub`.
  3. Lee el marcador → todas las rutas (`paths.*`) son relativas a `<HUB>`; `<ROOT>` = padre de `<HUB>`.
  4. Si no hallas el marcador ni los directorios de código, **avisa**; no inventes la ruta.

### Layout de código del proyecto

| Área | Ruta | Notas |
|------|------|-------|
| Frontend (Next.js 16 App Router) | `<ROOT>/src/app/` | `page.tsx` = wizard onboarding 5 pasos |
| API Routes | `<ROOT>/src/app/api/` | `check-status/`, `generate-workspace/` |
| Documentación del centro | `<HUB>/docs/` | Patrones + `index.md` + `arquitectura-general.md` |
| Documentos de referencia | `<ROOT>/docs/referencia/` | PDFs del cliente (cotización, libro de marca, formulario) |
| Materiales | `<ROOT>/docs/` | Excel de materiales presu_costo |

## 2. Documentación técnica = fuente de patrones (INSUMO del meta skill)

| Recurso | Ruta | Uso |
|---------|------|-----|
| **Índice maestro** | `<HUB>/docs/index.md` | Dispatcher «Cargar cuando…». El meta skill lo usa para **seleccionar** los patrones relevantes a una HU. |
| Arquitectura | `<HUB>/docs/arquitectura-general.md` | Mapa del sistema, paleta de marca, stack, costuras. |
| Patrones front | `<HUB>/docs/front/` | Un `.md` por patrón de UI/UX, componentes, formularios. |
| Patrones back | `<HUB>/docs/back/` | Un `.md` por patrón de API, integración Google Drive, cálculo. |
| Lecciones | `<HUB>/docs/lecciones.md` | Memoria de proceso, append-only. |

**Regla dura:** todo desarrollo respeta los patrones de `docs/`. Antes de escribir código, cargar los
patrones que apliquen (vía `index.md`) — no reinventar lo que ya existe.

## 3. Comandos por plataforma (test / build / calidad)

| Plataforma | Tests | Análisis estático | Build | Notas |
|------------|-------|-------------------|-------|-------|
| **Frontend** (Next.js 16 / React 19 / TS) | `npm run build` (verifica types) | `npm run lint` (ESLint) | `npm run build` | Tailwind CSS v4. No hay suite de tests unitarios aún. |
| **API Routes** (Next.js) | `npm run build` | `npm run build` (TypeScript check) | `npm run build` | Se verifican al buildear. |

**Comandos verificados en terminal (2026-08-19):**
```bash
npm run lint     # → eslint (pasa limpio)
npm run build    # → Build exitoso, rutas: /, /api/check-status, /api/generate-workspace
```

**Entorno de desarrollo:**
```bash
npm run dev      # → Next.js dev server en localhost:3000
```

**Dependencias clave:**
- next@16.3.0, react@19.2.8, typescript@5
- googleapis@174.0.1 (Google Drive/Sheets API)
- tailwindcss@4, lucide-react (iconos)

**Cobertura:** No hay suite de tests unitarios. La verificación se hace por `npm run build` (typecheck) + `npm run lint`. Si se añaden tests, documentar el runner aquí.

## 4. Especialistas por plataforma (roles para los agentes de implementación)

- **Frontend** → *ingeniero Next.js 16 / React 19 / TypeScript / Tailwind CSS*, experto en formularios multi-paso, estado persistido (localStorage), diseño responsivo mobile-first, paleta de marca VIHO.
- **Backend** → *ingeniero Next.js API Routes / Google Drive API / Google Sheets API*, experto en integración con servicios Google, manejo de credenciales, generación de carpetas y hojas de cálculo.
- **Reviewer** → revisión contra los patrones de `docs/` + checklist de calidad.

## 5. Política de commits y ramas (vinculante)

### Ramas
- **Rama principal:** `main`
- **Base por defecto para nuevas features:** `main`
- **Convención de nombre de rama:** `<tipo>/<TICKET>-<slug>`
  - Tipos: `feat`, `fix`, `change`, `chore`, `docs`
  - Ejemplo: `feat/VH-001-formulario-onboarding`

### Formato de commit
```
<tipo>(<scope>): <descripción corta>

<descripción opcional más detallada>

Ticket: VH-NNN
```

- **Tipos:** `feat`, `fix`, `change`, `chore`, `docs`, `refactor`, `test`
- **Scope:** módulo afectado (app, api, config, docs)
- **Atomicidad:** un commit = un cambio lógico de un solo ticket
- **Nunca:** `git add .` — añadir archivos explícitamente
- **Cuando falle un hook:** corregir y hacer commit nuevo, nunca reescribir el anterior

## 6. Fuente de verdad de requisitos y contrato de entrada

Los requisitos pueden llegar como:
- **Documento PDF/Excel** del cliente → convertir con `markitdown` y particionar con `/viho-particionar-hu`
- **Historia de usuario escrita** directamente en `.work/<ws>/<item>/docs/`
- **Conversación** → extraer criterios y escribir en `.work/<ws>/<item>/docs/`

**Formato esperado:** cada requisito con criterios de aceptación numerados, resultado esperado literal, y ruta de error.

## 7. Convención `.work/<ws>/<item>/`

```
.work/
├── README.md            ← la convención escrita donde se usa
├── _intro.md            ← narrativa del panorama (sin cifras)
└── producto/            ← workspace único
    └── <item>/          ← feat-… | change-… | fix-…
        ├── docs/        ← ENTRADA: requisitos
        ├── skills/SKILL.md   ← playbook generado
        ├── contexto-tecnico.md
        ├── validacion-requisitos.md
        ├── casos-prueba.md
        ├── analisis.md | diagnostico.md
        ├── plan.md
        ├── resultado.md
        ├── verificacion.md
        └── progreso.md  ← el ESTADO
```

- **Workspace único:** `producto` (no hay áreas con dueños distintos)
- **Prefijo de item:** `feat-`, `change-`, `fix-`
- **Slug:** descriptivo, minúsculas con guiones, sin número de ticket

## 8. Umbrales y modelos

- **Máximo criterios por item:** 30 (si se supera, partir)
- **Complejidad:** BAJA / MEDIA / ALTA (la define la forja en el triage)
- **Iteraciones máximas por fase:** ~3 vueltas antes de escalar

## 9. Crecimiento de la documentación (bucle de aprendizaje)

Al **cerrar** cada item:
1. **Lecciones** → anexar automáticamente a `docs/lecciones.md` (barra baja, sin aprobación)
2. **Patrones** → proponer en `docs/<slice>/` si el trabajo introdujo una técnica reutilizable (barra alta, requiere aprobación humana)
3. **Índice** → actualizar `docs/index.md` con el trigger del nuevo patrón

Al **arrancar** cada item:
- Mirar el derrotero: si el item toca una zona con filas pendientes de prioridad alta, **escribir ese patrón antes de forjar**.

Cada 5-10 items: revisión de lecciones acumuladas → promover repetidas a patrón.

## 10. Definición de terminado, % real y formato de `progreso.md`

### Definición de terminado
Un item está terminado cuando:
- **100% de criterios de aceptación** están en estado `CUMPLE`
- Cada criterio tiene **evidencia ejecutada y citada** (comando + salida, o `archivo:línea`)
- No quedan archivos fuera de alcance sin justificar
- Se hizo autorevisión del diff
- Se hizo commit siguiendo `config §5`

### Cálculo del porcentaje
```
% = criterios en estado CUMPLE / total de criterios de aceptación
```
Un criterio solo pasa a `CUMPLE` cuando existe evidencia. Sin evidencia, no cuenta.

### Formato de `progreso.md` (CONTRATO CRÍTICO — el renderer lo parsea)

```markdown
# Progreso: <ws>/<item>

## Fases
| Fase | Estado | Inicio | Fin | Notas |
|------|--------|--------|-----|-------|
| 1 · Entendimiento | COMPLETADA | 2026-08-19 | 2026-08-19 | |
| 2 · Diseño | EN_PROGRESO | 2026-08-19 | | |
| 3 · Implementación | PENDIENTE | | | |
| 4 · Verificación | PENDIENTE | | | |
| 5 · Cierre | PENDIENTE | | | |

## Criterios de aceptación (fuente del %)
| # | Criterio | Estado | Evidencia |
|---|----------|--------|-----------|
| 1 | El formulario muestra 4 pasos | CUMPLE | `npm run build` exitoso |
| 2 | Los datos se guardan en localStorage | PENDIENTE | |

## Métricas
- Criterios totales: 2
- Criterios CUMPLE: 1
- Porcentaje: 50%
- Confianza: auto | confirmado

## Registro de actividad
- 2026-08-19 10:00 — Inicio de fase 1
```

**Los cuatro encabezados `## Fases`, `## Criterios de aceptación`, `## Métricas`, `## Registro de actividad` son OBLIGATORIOS.** El renderer los busca por nombre exacto.

## 11. Proveedor de git / PRs

- **Proveedor:** Git local (repositorio en disco)
- **Cliente:** `git` CLI
- No hay integración con GitHub/GitLab/Azure DevOps todavía

## 12. Retrabajo e iteración entre fases

| Se descubre en… | La causa es… | Se vuelve a… |
|---|---|---|
| Verificación | defecto de implementación | Implementación |
| Verificación | el criterio no se diseñó | Diseño |
| Verificación | el requisito estaba mal | Entendimiento |
| Implementación | el plan no es implementable | Diseño |
| Cualquiera | cambió el alcance | Re-forjar |

Iterar dentro de una fase: ~3 vueltas automáticas; a partir de ahí, escalar.

## 13. Casos de prueba: la autoridad de verificación

- **Postura:** tu trabajo no es confirmar que funciona, es intentar romperlo
- **Cobertura:** feliz, negativos, bordes, permisos, regresión, integración
- **Clasificación:** `auto:<runner>` / `manual` / `RIESGO`
- **Runner actual:** no hay suite de tests automatizados. Verificación por `npm run build` + evidencia manual.
- **Runner futuro:** Playwright para E2E del wizard, Jest/Vitest para unit tests de API routes

## 14. Autonomía calibrada: dónde para el agente

**Para siempre** ante: ambigüedad real, cambio de alcance significativo, riesgo alto concreto, criterio en riesgo, retroceso, cierre.

**Autonomía plena** mientras: el panorama esté claro, los gates automáticos pasen, no haya nada que decidir.

## 15. Reapertura post-cierre

Si se encuentra un defecto después del cierre: nuevo item `fix-<slug>` que referencie el item original. No reabrir el cerrado.

Si cambia el requisito: nuevo item `change-<slug>`.

## 16. Pruebas end-to-end

- **Hoy:** no hay suite E2E
- **Futuro:** Playwright para el wizard de onboarding (flujo completo: login → paso 1 → ... → paso 5 → links de Drive)
- **Criterio para activar:** cuando el flujo del wizard esté estable y completo

## 17. Criterio técnico: autoridad de la arquitectura

La arquitectura del sistema está documentada en `docs/arquitectura-general.md`. Si un diseño contradice la arquitectura documentada, **se resuelve antes de implementar**, no durante.

Excepción: si la arquitectura está desactualizada respecto al código, se actualiza primero la doc.

## 18. Prevalidación de requisitos

Antes de forjar cualquier item, la prevalidación audita:
- Completitud (¿criterio tiene resultado esperado literal?)
- Consistencia (¿hay contradicciones?)
- Testabilidad (¿se puede verificar con evidencia?)
- Cobertura de la costura (si cruza capas, ¿está definido ambos lados?)
- Coherencia con la arquitectura
- Trazabilidad con la fuente

**Con bloqueantes: para.** No se arranca un item con requisitos rotos.

## 19. Modelo y esfuerzo del agente por fase

No aplica todavía (proyecto nuevo, sin históricos).

## 20. Verificación exhaustiva opcional

No aplica todavía.

## 21. Autorevisión de código antes de integrar

**Checklist mecánico (post-implementación):**
- [ ] `npm run build` pasa sin errores
- [ ] `npm run lint` pasa sin warnings nuevos
- [ ] No hay archivos fuera de alcance sin justificar
- [ ] No hay código de debug (`console.log` innecesarios, etc.)
- [ ] Los colores de la marca se usan desde constantes, no hardcodeados
- [ ] Las rutas de archivos son relativas, no absolutas
