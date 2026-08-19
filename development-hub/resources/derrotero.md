# Derrotero de extracción — {{PROYECTO}}

> **Qué es.** El **mapa antes que los documentos**. Se escribe recorriendo el código **sin redactar
> todavía ningún patrón**: identificar el mecanismo, anclarlo a rutas reales y asignarle un destino.
>
> **Por qué en este orden.** Leer para *identificar y anclar* cuesta una fracción de leer para
> *redactar*. El mapa completo hace visible el panorama antes de invertir en redacción, permite
> priorizar de verdad, y **ya es valor sin redactar**: una fila dice *dónde vive* ese mecanismo, que
> es la pregunta más frecuente.
>
> **Regla de oro.** No se inventa nada: cada fila sale de código real, leído de la **rama principal**
> (si hay ramas de trabajo activas, con una copia de solo lectura, para no mezclar lo que está a
> medias con lo que está en producción).
>
> Este archivo es **interno**: vive en `resources/`, no en `docs/`, y no es autoritativo.

---

## 1. Cómo se prioriza

Se ordena **contra el backlog de las próximas 4-8 semanas**. Se escriben primero los patrones que el
**próximo item va a necesitar cargar**. Un patrón que nadie va a cargar en tres meses **no se
escribe todavía**: se queda como fila, y eso está bien.

| Prioridad | Significa |
|---|---|
| ALTA | El trabajo de las próximas semanas lo toca. Se redacta ya. |
| MEDIA | Zona activa, pero no inmediata. Se redacta cuando un item la toque. |
| BAJA | Estable y poco tocada. Puede quedarse como fila un año. |

## 2. El mapa

| # | Patrón candidato | Fuente de la verdad (rutas reales) | Slice | Prioridad | Destino | Estado |
|---|---|---|---|---|---|---|
| 1 | {{Mecanismo}} | `{{ruta/real}}`, `{{ruta/real}}` | {{slice}} | ALTA | `{{slice}}/01` | pendiente |
| 2 | | | | | | |

<!-- Estados: pendiente · en-curso · escrito · descartado (con motivo). -->

## 3. Decisiones implícitas detectadas

<!-- Las que están en el código y en ningún texto ("aquí las fechas siempre se guardan en UTC",
     "este servicio nunca escribe, solo lee"). Suelen ser los MEJORES primeros patrones: son
     justo lo que un recién llegado —o un agente— viola sin darse cuenta. -->

| # | Decisión implícita | Dónde se ve | ¿Patrón o ADR? |
|---|---|---|---|
| | | | |

## 4. Rarezas y discrepancias del código real

<!-- Lo que despista al leer: cosas a medias, dos maneras de hacer lo mismo conviviendo, algo que
     dice ser configurable y no lo es, una versión declarada que no coincide con la que corre.
     Esto es oro y se pierde si no se escribe en el momento: es lo que el siguiente lector va a
     volver a descubrir perdiendo una tarde. -->

| # | Qué despista | Dónde | Nota |
|---|---|---|---|
| | | | |

## 5. Documentación previa: veredicto por documento

<!-- Solo en brownfield. Ninguna afirmación heredada entra al insumo sin contrastarse contra el
     código: el modo de fallo típico de la documentación previa es describir lo que se PRETENDÍA,
     no lo que se construyó. -->

| Documento previo | Destino | Veredicto |
|---|---|---|
| `{{ruta}}` | {{arquitectura / patrón NN / resources / decisiones / archivo histórico}} | {{verificado · corregido: {{qué} · descartado: {{por qué}}}} |
