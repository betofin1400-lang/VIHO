---
name: viho-desarrollar
description: Runner del pipeline de una funcionalidad. Ejecuta el playbook generado en .work/<ws>/<item>/skills/SKILL.md una fase por invocación, con memoria de resume en progreso.md. En el cierre dispara el aprendizaje, la autorevisión y el commit.
---

# desarrollar — el runner

> **STUB — rellenar.** El contrato está completo; falta el procedimiento con los comandos y el
> vocabulario de tu proyecto.

## Por qué existe

Los playbooks viven **fuera** de `.claude/skills/`, así que no son comandos registrados: son
**archivos de datos**. Este runner es su intérprete. Carga playbook y estado, ejecuta **una fase**,
actualiza el estado y para.

Ese es el truco arquitectónico central del centro: permite tener N playbooks vivos sin contaminar el
espacio de nombres de comandos, y hace que cada item lleve su propio método dentro.

## Los seis artefactos que carga

1. El **playbook** — si falta: «forja primero» y **detente**.
2. El **estado** (`progreso.md`).
3. El **contexto técnico**.
4. Los **casos de prueba** — si faltan: generarlos primero. **No hay verificación sin casos.**
5. La **configuración** del proyecto.
6. Los **requisitos**.

## Cómo decide qué hacer

- **Fase explícita** en los argumentos → corre solo esa. Si no, toma el «siguiente paso» del estado:
  la primera fase o cluster que no esté hecho.
- **Gates de entrada** que impiden saltar fases: *diseño* exige el documento de entendimiento;
  *implementación* exige el plan **y pruebas que fallan**; *verificación* exige plan y resultado.
- **Regla de oro: nunca rehacer una fase ya hecha** sin que el usuario lo pida.

## Autonomía por puntos de decisión

> El diseño menos obvio y el que más conviene copiar tal cual.

**Por defecto encadena las fases sin pedir permiso** mientras el panorama esté claro y los gates
automáticos pasen — preguntar «¿sigo?» sin nada que decidir es fricción sin valor y entrena a la
gente a decir «sí» sin leer.

**Para siempre** ante: (1) ambigüedad real; (2) cambio de alcance —lo **propone**, no lo decide—;
(3) riesgo alto concreto surgido al ejecutar; (4) un criterio en riesgo o casos manuales pendientes;
(5) retroceso o re-forja; (6) **el cierre, siempre**.

Y el corolario: **la complejidad calibra la ceremonia, no el número de interrupciones.** Un item
complejo no interrumpe más: usa plantilla extendida y suma **un** punto de control tras el diseño,
solo si introdujo contrato o arquitectura nuevos.

## Reglas transversales

- **Pruebas primero:** en diseño deben **fallar** (con la salida citada); en implementación, pasar.
- **Evidencia:** nunca afirmar «las pruebas pasan» sin correr el comando real y **citar la línea**.
- **Reutilización entre items:** antes de crear algo, mirar si otro item o el código ya lo tienen.
  Reusarlo **y reportarlo**. Es memoria organizacional barata.
- **Guarda de alcance:** al terminar la implementación, contrastar `git diff --name-only` con los
  archivos del plan. Lo que sobre: se justifica por escrito o se revierte.
- **Cobertura del 100 % de los casos** en verificación, con reporte
  `total | ejecutados | verdes | rojos | no ejecutados (motivo)`. Un caso no corrido es un hueco que
  **bloquea el cierre de su criterio**; no se asume verde.
- **Integridad de la prueba:** un verde cuenta solo si (a) se pone **rojo al revertir el cambio por
  el camino real** y (b) no tiene aserciones que no puedan fallar. **Un verde que no puede fallar es
  un hueco, no evidencia.**
- **Paralelizar con unión:** lo que produce evidencia se lanza en paralelo pero **se espera**; lo que
  es refresco cosmético se puede lanzar y olvidar.

## Matriz de retrabajo

| Se descubre en… | La causa es… | Se vuelve a… |
|---|---|---|
| Verificación | defecto de implementación | Implementación |
| Verificación | el criterio no se diseñó | Diseño |
| Verificación | el requisito estaba mal | Entendimiento |
| Implementación | el plan no es implementable | **Diseño** (no se hackea alrededor del plan) |
| Cualquiera | cambió el alcance | **Re-forjar** |

Iterar *dentro* de una fase es automático hasta el umbral de `config §8`; después, escala y pregunta.

## Al terminar cada fase

1. Actualizar el estado: fase marcada (con **checkpoint exacto** si quedó a medias), siguiente paso
   recalculado, veredictos por criterio, porcentaje, confianza, y **una fila en el registro de
   actividad**.
2. **Regenerar el tablero** — inline y determinista, y es un **GATE, no una recomendación: una fase
   sin regenerar no se da por cerrada.** No hay ningún hook que lo haga por ti (ver `viho-sitio/SKILL.md`):
   si el runner se salta el render, el tablero miente y nadie se entera — y un tablero desactualizado
   es peor que uno ausente, porque se le cree. *(Si el proyecto no tiene tablero, declararlo en
   `config §10`; si no, el flujo fallará en cada cierre de fase intentando refrescar algo inexistente.)*

## El cierre

1. **Gate:** resumen de criterios con evidencia y porcentaje. **No se cierra por debajo del 100 %**
   sin una desviación justificada y aceptada explícitamente.
2. **Aprendizaje — patrón:** si salió una técnica reutilizable, redactar un borrador y presentarlo.
   **Nunca escribir en `docs/` sin aprobación.**
3. **Aprendizaje — lección:** **anexar automáticamente** a `docs/lecciones.md`, comprobando que no
   exista una equivalente. *(Las dos barras distintas son el motor: la baja hace que la memoria
   crezca a diario; la alta mantiene la biblioteca digna de cargarse a ciegas.)*
4. **Autorevisión del diff** con ojo de revisor, **no de criterio**: cerrar los criterios no basta,
   porque un criterio describe el requisito, no el sistema.
5. **Commit** según la política del equipo.
6. Cerrar el estado y regenerar el tablero.

## TODO al montar

- [ ] Sustituir los comandos por los de `config §3`.
- [ ] Definir **una sola** vía de refresco del tablero, y que sea la del método (inline, aquí y en la
      forja). *(En el centro de referencia conviven dos contradictorias dentro del mismo archivo
      —script inline y subagente en segundo plano—, resto de una arquitectura anterior que no se
      limpió. Nadie sabe cuál es la buena.)* Y escribir su límite donde se lea: **lo que se edita a
      mano fuera del método no dispara nada**.
- [ ] Decidir si el registro de actividad es **obligatorio** en el gate de fase. Es el único dato que
      no alimenta ningún número, así que es lo primero que se sacrifica con prisa: o se exige, o el
      tablero no promete un log.
- [ ] Concretar qué significa «revertir por el camino real» en tu stack.
