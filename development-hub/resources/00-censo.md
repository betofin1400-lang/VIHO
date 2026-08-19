# Censo del proyecto — {{PROYECTO}}

> **Solo para montaje brownfield.** Si el proyecto arranca de cero, **borra este archivo**: no hay
> nada que censar y un censo vacío solo añade ruido. Guía: capítulo `03`, Fase 0.
>
> **Fecha del censo:** {{aaaa-mm-dd}} · **Quién lo hizo:** {{nombre}}

Este archivo se escribe **una vez, antes de crear nada más**, y luego se consulta. No se mantiene al
día: es una foto fechada del punto de partida, y su valor está en haberla tomado antes de decidir.

> **Por qué no se salta.** Un montaje brownfield que empieza creando carpetas produce un centro que
> ignora la mitad de lo que ya existe, y a las dos semanas el proyecto tiene **dos fuentes de verdad**
> compitiendo. El censo es lo que evita esa duplicación.

---

## (a) Repositorios y layout

> Alimenta directamente `codigo.repos` del marcador. Rellénalo **antes** de tocar
> `.centro-desarrollo.json`.

| Repo / carpeta | Qué contiene | Stack | Dónde corren sus pruebas |
|---|---|---|---|
| {{backend/}} | {{API, dominio, migraciones}} | {{FastAPI · Python}} | {{`pytest` desde la raíz del repo}} |
| {{frontend/}} | {{cliente web}} | {{React + Vite}} | {{`npm test`; E2E en `e2e/`}} |

- **¿Monorepo o varios repos?** {{uno solo / N repos}}
- **Consecuencia para el centro:** {{un solo repo → el centro va DENTRO del repo (01 §1.b). Varios
  repos → centro hermano, con su propia maquinaria de rama.}}
- **Otras carpetas de primer nivel que importan:** {{`ops/`, `scripts/`, `docker-compose*.yml`}}

---

## (b) Documentación previa

> Entrada de la Fase 2 (absorción). **Una fila por archivo o conjunto**, con la fecha del **último
> cambio real** —no la del último retoque de formato— y una nota de sospecha.
>
> **La fecha es el dato más útil de toda la tabla.** Un documento que nadie ha tocado en catorce
> meses mientras el módulo que describe cambiaba cada semana no es documentación: es una trampa.
> Sácala del historial, no del encabezado del archivo:
>
> ```bash
> git log -1 --format=%ad --date=short -- <ruta>
> ```

| Ruta | Tema | Último cambio real | Sospecha |
|---|---|---|---|
| {{`docs/arquitectura.md`}} | {{visión general}} | {{2025-03-11}} | {{describe una capa que ya no existe}} |
| {{`.centro/`}} | {{ADRs, bitácora, HUs}} | {{2026-07-30}} | {{parece vigente; auditar 3 al azar}} |

- **¿Hay solapamiento entre dos generaciones de documentación?** {{sí/no — cuáles}}
- **Decisión pendiente sobre ese solapamiento:** {{se resuelve en la Fase 2, §4.c}}

> **No heredes nada todavía.** La política de la Fase 2 es de **desconfianza explícita**: un documento
> entra en el centro cuando alguien lo ha contrastado con el código, no cuando existe.

---

## (c) Trabajo en vuelo

> Determina qué **no** se toca durante el montaje (§6). Un centro que reescribe archivos de una rama
> viva genera conflictos que se cobran en el peor momento.

| Funcionalidad a medias | Rama | Quién la lleva | Zona del código a NO tocar |
|---|---|---|---|
| {{...}} | {{...}} | {{...}} | {{...}} |

- **¿El sistema está en producción?** {{sí/no}} — si lo está, el primer item ya toca código con
  usuarios reales, y eso adelanta las secciones de calidad de la configuración (03 §3.d).

---

## (d) Rarezas

> **Esto es oro y se pierde si no se escribe en el momento.** Es lo que el siguiente lector —o el
> agente— va a volver a descubrir a base de perder una tarde. Cosas a medias, un módulo que dice ser
> configurable y no lo es, dos maneras de hacer lo mismo conviviendo, una versión declarada que no
> coincide con la que corre.

| Rareza | Dónde se ve | Qué hace perder tiempo |
|---|---|---|
| {{...}} | {{...}} | {{...}} |

---

## Conclusiones que condicionan el montaje

> Las cuatro decisiones que salen del censo y que hay que llevarse a la Fase 1. Escríbelas aquí
> aunque parezcan obvias: dentro de un mes nadie recordará por qué se eligió así.

| Decisión | Qué se decidió | Porque el censo mostró… |
|---|---|---|
| Dónde vive el centro | {{dentro del repo / hermano}} | {{(a): un solo repo}} |
| Slices de `docs/` | {{`back`, `front`}} | {{(a): dos stacks con vocabulario propio}} |
| Workspaces de `.work/` | {{uno: `producto`}} | {{(c): no hay módulos con dueños distintos}} |
| Qué se hereda de la documentación previa | {{nada aún; auditar N archivos en Fase 2}} | {{(b): abundante pero sin contrastar}} |
