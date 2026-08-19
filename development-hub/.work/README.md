# .work — el trabajo, por workspace y por funcionalidad

> Esta convención se lee **donde se usa**. Quien abre esta carpeta para crear un item tiene aquí las
> reglas; no hace falta ir a buscar la guía.

```
.work/
├── _intro.md              # narrativa del panorama (se escribe a mano, SIN cifras)
├── _ejemplo/<item>/       # item de referencia (no es un workspace real)
└── <workspace>/           # los declarados en `workspaces` del marcador
    ├── _intro.md          # narrativa de este workspace
    └── <item>/            # feat-<slug> | change-<slug> | fix-<slug>
```

Un item se referencia siempre como **`<workspace>/<item>`**, y ese es el argumento de todas las
skills.

## Estructura de un item

```
.work/<ws>/<item>/
├── docs/                        ENTRADA — los requisitos (lo único que escribe una persona)
│   ├── HU-01-*.md               una historia por archivo (o `reporte.md` para un fix)
│   ├── _indice-hu.md
│   └── _contexto-negocio.md     glosario, reglas transversales, actores
├── validacion-requisitos.md     prevalidación: huecos, ambigüedades, contradicciones
├── contexto-tecnico.md          los 3-8 patrones que aplican, con sus anclas de código
├── skills/SKILL.md              el playbook. GENERADO: no editar a mano
├── casos-prueba.md              el contrato de verificación: criterios -> casos
├── progreso.md                  EL ESTADO. Memoria de resume y fuente del %
├── analisis.md | diagnostico.md fase 1 — entendimiento / causa raíz con evidencia
├── plan.md (+ contrato-api.md)  fase 2 — diseño + pruebas que fallan
├── resultado.md                 fase 3 — qué se aplicó, comandos con su salida
└── verificacion.md              fase 4 — veredicto por criterio con evidencia
```

## Flujo

1. **Escribe los requisitos** en `<item>/docs/`. Si llegaron como documento, la partición los trocea
   en una historia por archivo sin resumirlos.
2. **Forja**: triage, orden de trabajo, selección de patrones, casos de prueba, playbook y estado.
3. **Desarrolla**: una fase por invocación, con memoria de resume. En el cierre: aprendizaje
   (patrón propuesto, lección anexada), autorevisión y commit.
4. **El tablero** refleja el estado automáticamente al regenerarse.

## Reglas

- `<workspace>` debe existir en `workspaces` del marcador. Si no, sus items **no aparecen** en el
  tablero.
- El prefijo del item (`feat-`/`change-`/`fix-`) **no es cosmético**: decide qué playbook se genera
  y qué artefactos corresponden.
- El **ticket va en la rama**, no en el nombre de la carpeta. Una carpeta se lee; un identificador
  no dice nada.
- **Un item ≤ 30 criterios de aceptación.** Si excede, se parte. Es lo que evita el item-monstruo
  que nunca cierra.
- `docs/` de un item es **entrada** (requisitos). Los **patrones** viven en `docs/` del centro, una
  sola vez, compartidos por todos los items. **No documentes el proyecto dentro de un item**: se
  pierde al cerrar.
- Las carpetas y archivos que empiezan por `_` **no son trabajo**: son metadatos o material
  didáctico, y el descubrimiento automático los ignora.
- **Sin `progreso.md` un item es invisible** en el tablero y en todos los agregados. El chequeo de
  integridad lo reporta.
- Los archivos generados (playbook, páginas del tablero) **no se editan a mano**: el próximo paso
  los pisa.

## Primer item

Cuando se cierre el primer item real (`feat-*` o `fix-*`), quedarse como item de referencia para
el centro. No hay ejemplo heredado del template — el primero que cierre documenta el flujo real.

## Las plantillas

| Archivo | Para |
|---|---|
| `.work/_plantilla-HU.md` | una historia de usuario (`<item>/docs/HU-NN-<slug>.md`) |
| `.claude/skills/forjar-skill/plantillas/progreso.md` | el estado de un item — **contrato con el generador del tablero** |
| `.claude/skills/forjar-skill/plantillas/skill-especializado.md` | el playbook que estampa la forja |
