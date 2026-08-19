# ADR-000 · {{Título de la decisión, en afirmativo}}

<!--
  PLANTILLA. Copia este archivo como `ADR-NNN-<slug>.md` y numera de forma append-only.

  CAPA OPCIONAL. Si no vas a llevar registro de decisiones, borra `docs/decisiones/` y la sección 6
  del índice. No la montes «por si acaso»: un directorio de ADRs con un solo archivo plantilla es
  ruido, y peor, sugiere que las decisiones están registradas cuando no lo están.

  UN ADR NO ES UN PATRÓN. El ADR dice QUÉ se decidió y por qué se descartó lo demás; el patrón dice
  CÓMO se hace hoy y dónde está el código que lo hace. No se sustituyen y no se duplican: si un ADR
  empieza a explicar el mecanismo, ese contenido pertenece a un patrón.

  LOS ADR SON INMUTABLES. No se editan para reflejar un cambio de opinión: se escribe otro que
  supera a este, y este pasa a estado `superado por ADR-NNN`. Un registro que se reescribe pierde
  justo lo que lo hace valioso — poder ver qué se sabía en el momento de decidir.
-->

- **Estado:** {{propuesto | aceptado | superado por ADR-NNN | descartado}}
- **Fecha:** {{AAAA-MM-DD}} · **Deciden:** {{quiénes}}
- **Cargar cuando…** {{el trigger para el índice: en qué tarea importa conocer esta decisión}}

## Contexto

{{Qué situación obliga a decidir. Restricciones reales (plazo, equipo, sistema existente, requisito
normativo). Sin contexto, dentro de un año la decisión parecerá arbitraria o estúpida, y alguien la
revertirá sin saber contra qué estaba luchando.}}

## Decisión

{{Qué se decidió, en una o dos frases y en afirmativo. «Usaremos X para Y.»}}

## Alternativas consideradas

| Alternativa | Por qué no |
|---|---|
| {{opción}} | {{el motivo concreto: no una etiqueta como «no escala», sino contra qué restricción choca}} |

## Consecuencias

- **A favor:** {{lo que ganamos}}
- **En contra:** {{el precio que aceptamos pagar, dicho sin adornos}}
- **Reversibilidad:** {{qué costaría deshacerlo, y cuándo dejaría de ser reversible}}
- **Qué obliga a revisar esta decisión:** {{la señal concreta que dispararía un ADR nuevo}}

## Patrones afectados

- {{`docs/<slice>/NN`: qué hay que escribir o actualizar para que la decisión se aplique de verdad.
  Una decisión que no aterriza en un patrón se olvida en tres semanas.}}
