---
name: viho-verificar-docs
description: Detecta deriva entre la biblioteca de patrones y el código real de la rama principal. Verifica la integridad del índice, que las anclas de código existan, contrasta afirmaciones y evalúa si los triggers "Cargar cuando..." siguen siendo certeros. Propone correcciones con aprobación. Correr periódicamente.
---

# verificar-docs

> **STUB — rellenar.** El mecanismo es agnóstico; lo que cambia es cómo se accede a la rama principal
> de tus repos.
>
> **No la montes antes de tener ~10 patrones**: antes no hay deriva que detectar y es trabajo
> ceremonial.

## Por qué importa

Los patrones son el **combustible** de la selección de contexto: si el código cambia y el documento
no, la forja selecciona contexto obsoleto **y el agente lo aplica con confianza**. Documentación
desactualizada aquí no es un defecto estético: **envenena activamente el desarrollo**, y lo hace en
silencio, porque un documento viejo se lee igual de bien que uno correcto.

## Dos capas

**Capa 1 — integridad del índice (determinista, siempre).** Todo patrón está enlazado en el índice;
todos los enlaces resuelven; los conteos se **derivan**. Son **fallos**, no avisos: romperían la
selección. *(Esto ya lo hace `doctor.py`, bloque D. No lo dupliques: invócalo.)*

**Capa 2 — deriva real contra la rama principal.** Por cada patrón:

1. **Anclas:** extraer el bloque «Fuente de la verdad» y comprobar que esas rutas **existan**. Una
   ancla muerta significa que el patrón cita código movido o borrado.
2. **Afirmaciones:** tomar 2-3 de alto valor (una clase, una firma, un fragmento «verbatim») y
   contrastarlas contra el código, **citando `archivo:línea`**.
3. **Calidad del trigger:** ¿la línea «Cargar cuando…» sigue describiendo lo que el documento hace?
   Si quedó floja o genérica, proponer una más específica: **mejora la puntería de toda selección
   futura**, y es la parte que más se descuida.

## Reglas duras

- **Sin evidencia contra el código, no es deriva.** Toda deriva se cita.
- **Solo la rama principal manda.** Si un repositorio está en una rama de trabajo, se usa una copia
  de solo lectura de la principal: comparar contra trabajo a medias produce falsas derivas.
- **Las correcciones a `docs/` requieren aprobación humana.** Es material curado.
- Los **huecos** también se registran: patrones que el código ya necesita y que no existen.

## Salida

`docs/_verificacion/verificacion-<fecha>.md`: por documento, veredicto (`al día` / `deriva` /
`ancla muerta`), evidencia citada y correcciones propuestas.

## Aviso honesto

En el centro que sirvió de referencia, este mecanismo **está diseñado pero nunca se ha rodado**: su
directorio de reportes está vacío y sus propios conteos de patrones ya derivaron en tres archivos
distintos. La moraleja es doble: **la fidelidad no se mantiene sola**, y **cualquier conteo escrito a
mano se desactualiza** — que los cuente el script.

## TODO al montar

- [ ] Definir cómo se obtiene la rama principal de cada repo sin ensuciar el trabajo en curso.
- [ ] Fijar la **cadencia** y quién la dispara. «Correlo de vez en cuando» no ocurre nunca: átalo a
      un hito (cada N items cerrados, o tras cada integración grande).
- [ ] Decidir el tamaño de la muestra por documento y cuándo se amplía.
