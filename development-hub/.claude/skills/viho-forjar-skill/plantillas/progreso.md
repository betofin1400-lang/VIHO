# Progreso — {{WORKSPACE}}/{{ITEM}}

<!--
  CONTRATO. Este archivo lo CREA la forja, lo ACTUALIZA el runner y lo PARSEA el generador del
  sitio. Los encabezados `## ...` de abajo son el contrato: si cambian, el generador deja de leer
  esa sección y la página se genera igual, sin esa información y sin ningún error. Por eso el
  chequeo de integridad valida que estén los cuatro obligatorios:
      ## Fases · ## Criterios de aceptación · ## Métricas · ## Registro de actividad
  Todo lo demás (supuestos, notas, avance por requisito) es opcional pero recomendado.
-->

- **item:** `{{ITEM}}` · **workspace:** `{{WORKSPACE}}` · **tipo:** {{feature|change|fix}}
- **complejidad:** {{BAJA|MEDIA|ALTA}} · **plantilla:** {{MINIMA|EXTENDIDA}} · **modo rápido:** {{sí|no}}
- **forjado:** {{AAAA-MM-DD}} · **autor:** {{Nombre}} <{{correo}}>
- **resumen:** {{Una o dos frases en prosa: de qué trata esta funcionalidad. Lo lee quien retoma el
  item dentro de dos semanas y quien abre el detalle en el tablero.}}
- **rama (código):** `{{rama}}` · **base:** `{{base}}` · **repos:** {{alias, alias}}
- **autonomía:** {{encadena · punto de control tras DISEÑO (si hay contrato nuevo) · CIERRE siempre}}
- **prevalidación:** {{listo | listo-con-supuestos | bloqueantes}} → [`validacion-requisitos.md`](validacion-requisitos.md)
- **casos de prueba:** [`casos-prueba.md`](casos-prueba.md) — {{N}} casos · auto {{N}} · manual {{N}} · riesgo {{N}}

<!-- Notas fechadas: el contexto vivo que un agente que retoma necesita para no repetir una
     investigación ya hecha. Se anexan, no se reescriben. -->
> **{{AAAA-MM-DD}} — {{titular de la nota}}.** {{Decisión, desbloqueo o dependencia cerrada, con su
> evidencia.}}

## Supuestos

**Por ratificar**
1. {{supuesto}}

**Ratificados por el dev** — ({{AAAA-MM-DD}}) {{qué se ratificó}}

## Fases

| Fase | Artefacto | Estado |
|------|-----------|--------|
| 1 · Entendimiento | `analisis.md` \| `diagnostico.md` | pendiente |
| 2 · Diseño (+pruebas que fallan) | `plan.md` (+ `contrato-api.md`) | pendiente |
| 3 · Implementación | `resultado.md` | pendiente |
| 4 · Verificación | `verificacion.md` | pendiente |
| 5 · Cierre | commit + aprendizaje | pendiente |

<!-- Estados: `pendiente` · `en-curso` · `hecho (AAAA-MM-DD) — qué se logró`.
     Si una fase queda a medias, se anota el CHECKPOINT EXACTO: qué se hizo, qué archivos, qué falta.
     Cuesta dos líneas y ahorra media hora al retomar. -->

## Avance por requisito

<!-- Solo en items con varios requisitos. Es lo que permite el cierre parcial visible. -->

| Requisito | Cluster | Fase | Criterios CUMPLE/total | % | Estado |
|---|---|---|---|---|---|
| {{HU-01 · título}} | C1 | 1 | 0/{{n}} | 0 | pendiente |

## Criterios de aceptación

<!-- LA FUENTE DEL %. Un criterio pasa a CUMPLE solo con evidencia EJECUTADA y citada: el comando
     con su salida, o archivo:línea. Sin evidencia no cuenta. -->

| Criterio | Casos | Veredicto | Evidencia |
|---|---|---|---|
| CA-1 | TC-01, TC-02 | pendiente | — |

<!-- Veredictos: `CUMPLE` · `NO` · `pend-confirm` (falta validación humana) · `RIESGO` (no
     verificable: se escala, no se cierra). -->

## Métricas

- **%** = {{criterios CUMPLE}} / {{total}} = **{{n}}**
- **confianza:** {{auto | confirmado}}
- **estado:** {{pendiente | en-curso | completado | reabierto}}
- **siguiente paso:** {{la fase o cluster por el que sigue el runner}}
- **retrabajo:** {{fase reabierta, motivo, iteración}} · **cobertura (señal secundaria):** {{n/a}}

## Registro de actividad

<!-- Una fila por fase completada (o por hito dentro de ella). Es el único dato que no alimenta
     ningún número, así que es el primero que se sacrifica con prisa — y es lo que hace que el
     tablero cuente QUÉ pasó y no solo CUÁNTO. O es obligatorio en el gate de fase, o el sitio no
     promete un log. -->

| Fecha | Fase | Qué se ejecutó | Evidencia | Archivos |
|---|---|---|---|---|
