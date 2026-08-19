---
name: viho-casos-prueba
description: Autoridad de verificación. Dado un item con requisitos, genera la suite exhaustiva de casos en .work/<ws>/<item>/casos-prueba.md: cada criterio se descompone en casos (feliz, negativo, borde, permisos, regresión), cada caso se clasifica por plataforma y automatizabilidad, y la verificación tiene la obligación de ejecutarlos todos.
---

# casos-prueba

> **STUB — rellenar.** La doctrina está escrita y es la parte transferible; los runners y las
> dimensiones de tu dominio son lo que falta.

## La postura

**Tu trabajo no es confirmar que el código funciona: es intentar romperlo.** El comportamiento, los
mensajes, los límites y las reglas se comparan **carácter por carácter**. Una diferencia —«guardar»
frente a «Guardar», un `>=` por un `>`, un mensaje parafraseado— es **NO CUMPLE**, no «casi».

**Por defecto un criterio es NO CUMPLE** hasta que la evidencia lo pruebe. Diseña el caso que **más
probablemente falle**.

## Dimensiones de cobertura

feliz · **negativos con el mensaje literal** · bordes y límites · permisos y roles · estados y
transiciones · **regresión** · datos y persistencia · integración entre capas · las propias del
dominio *(TODO: las tuyas — concurrencia, cobros, documentos, lo que en tu sistema rompa de verdad)*.

**Un criterio con un solo caso feliz casi siempre está sub-cubierto.**

## Crítico de completitud

Antes de dar la lista por cerrada, la auto-crítica adversarial. Es lo que separa una lista de casos
de un contrato:

- ¿Qué caso encontraría **un revisor manual** que no está en la lista?
- ¿Qué pasa si el dato **no existe**, llega **vacío**, o llega **dos veces**?
- ¿Qué criterio depende de algo que **otro equipo** puede cambiar sin avisar?
- ¿Qué caso **«obvio» di por probado sin escribirlo?** Escríbelo: **lo no escrito no se ejecuta y se
  escapa.**

Lo añadido y lo descartado (con su motivo) se registran en la sección «Cobertura auditada». Un
descarte razonado evita que la siguiente pasada lo vuelva a considerar.

## Clasificación

- **Plataforma** — a qué repo/slice pertenece.
- **Nivel** — unitario, de integración, de extremo a extremo.
- **Automatizabilidad** — `auto:<runner>` *(TODO: los runners de `config §3`)* · `manual` · `RIESGO`.

**`manual` es la excepción, no el refugio.** Antes de marcarlo hay que **demostrar** por qué no se
puede automatizar; si dudas, es automatizable. Un caso que pudo automatizarse y quedó manual es un
**hueco de verificación** disfrazado de tarea.

**`RIESGO`** es distinto: el caso **no se puede verificar** con lo que hay (falta infraestructura,
falta un dato de producción, no se puede manipular el reloj). Se escala, se declara, y **no cuenta
como cumplido**.

## Salida

`casos-prueba.md` con: resumen de automatización · **matriz de casos** (`Caso | Criterio | Título |
Precondición | Pasos | Datos | Resultado esperado | Tipo | Automatizable`) con identificadores
estables `TC-NN` · **cobertura auditada** · **trazabilidad criterio → casos**.

## TODO al montar

- [ ] Fijar los prefijos `auto:<runner>` reales y de dónde sale cada comando.
- [ ] Añadir las dimensiones del dominio y **quitar las que no apliquen**.
- [ ] Decidir dónde viven las pruebas de cada plataforma y con qué convención de nombres.
- [ ] Definir qué evidencia se acepta para un caso manual (captura, salida de consola, firma).
