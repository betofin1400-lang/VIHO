# Metodología y Meta-skill

<!--
  PLANTILLA · Esta página explica el MOTOR: por qué se fabrica un playbook por item en vez de
  escribir uno genérico, cómo se selecciona el contexto, qué exige cada fase, cómo se para y se
  retoma, y cómo crece la documentación con el trabajo hecho.

  Casi todo lo que sigue es del método y vale tal cual: NO lo reescribas por reescribirlo. Lo que
  hay que sustituir son los tokens en minúscula, que es donde el método se encuentra con tu stack:
  el árbol de complejidad (qué zonas de TU dominio son sensibles), las condiciones del modo rápido,
  el tope de criterios y los gates que dependen de tus herramientas.

  El catálogo de skills NO va aquí: esa página se genera sola desde los frontmatter.
-->

## Resumen

En {{PROYECTO}} no se improvisa el método por funcionalidad, pero tampoco se aplica un playbook
genérico: para **cada item de trabajo se fabrica el suyo**. El meta-skill `forjar-skill` lee los
requisitos del item, lo clasifica, elige del set de patrones **solo los que ese item va a tocar** y
estampa un playbook autosuficiente en `.work/<ws>/<item>/skills/SKILL.md`. Después, `desarrollar` lo
interpreta fase por fase contra `progreso.md`, que es a la vez la memoria del item y la fuente de
las páginas de avances.

## Por qué existe un meta-skill

Un método genérico obliga al agente a **re-descubrir en cada funcionalidad qué patrones existen y
dónde viven**. Ese redescubrimiento no es gratis ni fiable: cuesta contexto, y cuando falla no avisa
—simplemente el item se construye sin el patrón que lo gobernaba, y el desajuste aparece en
producción.

El meta-skill invierte el orden. **No desarrolla: fabrica el que desarrollará.** Compila tres cosas
en un único documento:

- el **método** — el esqueleto de cinco fases con sus gates, idéntico para todos los items;
- el **contexto** — los patrones técnicos que este item concreto necesita, con sus anclas de código
  ya verificadas;
- la **configuración** — los parámetros del proyecto, que el playbook **referencia** desde
  `.claude/config-proyecto.md` en vez de duplicar.

El resultado debe ser **autosuficiente**: un item reabierto dentro de seis meses tiene que poder
ejecutarse leyendo su propia carpeta, sin reconstruir la conversación que lo originó.

Dos consecuencias de diseño que conviene tener presentes. La primera: los playbooks viven **fuera**
de `.claude/skills/`, así que no son comandos registrados sino **archivos de datos** — por eso hace
falta un runner que los interprete, y por eso pueden convivir N items vivos sin contaminar el
espacio de nombres. La segunda: re-forjar un item **actualiza**, no duplica; vuelve a hacer el
triage, vuelve a seleccionar el contexto y regenera el playbook sobre el mismo estado.

## Cómo se selecciona el contexto: por trigger, no por tema

Es la parte que da valor a todo lo demás, y la que más fácil se hace mal.

Los patrones de `docs/` se indexan en `docs/index.md` con una columna **«Cargar cuando…»**. Esa
columna **no describe de qué trata el documento**: describe lo que el desarrollador **va a hacer** —
un símbolo que va a tocar, un archivo que va a abrir, un síntoma que está depurando. La diferencia
es operativa: un trigger que nombra la entidad central del sistema no selecciona nada, porque casi
todo el set habla de ella; uno que nombra el símbolo exacto que se va a escribir selecciona un solo
patrón.

**Por qué tres que aplican valen más que diez «por si acaso».** Cada documento cargado de más entra
al contexto con **el mismo peso** que los que sí importan y compite con el código real que hay que
leer después. Peor: un patrón que no aplica no se ignora solo. **Se aplica igual, con total
seguridad**, porque nada le dice al agente que no venía a cuento.

El procedimiento de selección es este:

1. Por cada criterio de aceptación, escribir en una línea **qué toca**, en el vocabulario del código:
   qué símbolo, qué archivo, qué pantalla, qué estado, qué endpoint.
2. Mirar primero la **navegación rápida por objetivo** del índice. Si la tarea empareja una de sus
   filas, esa secuencia ya viene ordenada y filtrada y **manda sobre la tabla**.
3. Si no empareja, barrer las columnas «Cargar cuando…» de cada slice y quedarse solo con los
   triggers que emparejan de verdad.
4. **Respetar los disparadores negativos y los reenvíos.** Están escritos para poder decir que no. Si
   dos filas emparejan con lo mismo, releer sus negativos: una de las dos sobra.
5. **Cruzar la costura.** Si el patrón elegido aparece en el mapa de costuras entre slices, se carga
   el **par completo** y se anota quién es la autoridad. Cargar un solo lado es diseñar la mitad del
   contrato y descubrir la otra mitad en producción.
6. **Calibrar a 3-8 documentos.** Si salen más, casi siempre el item está mal cortado: se parte en
   clusters y cada uno hace su propia selección.
7. **Abrir cada documento y extraer su bloque «Fuente de la verdad»**: esas rutas son las anclas de
   código del item, y se comprueba que existen antes de citarlas. Un ancla que no se abrió no se
   cita; si el símbolo se movió, el documento tiene **deriva** y se remite a `verificar-docs`.

Todo eso se escribe en `contexto-tecnico.md`, que tiene dos secciones y no una: la tabla de patrones
elegidos con **el trigger que emparejó**, y **«Descartados y por qué»** con el disparador negativo
que excluyó a cada candidato cercano. Esa segunda sección es la que evita que la siguiente forja
repita el mismo análisis.

**El corolario incómodo:** un patrón sin trigger es invisible. Por eso, cuando el cierre propone un
patrón nuevo, entra con su fila en el índice **en el mismo cambio**, y su «Cargar cuando…» se escribe
sobre lo que el desarrollador va a hacer. Un documento excelente que nadie carga nunca no existe.

### Antes de seleccionar: triage y clusters

El **tipo** lo fija el prefijo del item (`feat-`, `change-`, `fix-`), sin discusión. La
**complejidad** la decide un árbol en el que manda la primera coincidencia:

| Nivel | Cuándo |
|---|---|
| ALTA | {{las zonas sensibles del dominio de este proyecto: escritura hacia sistemas externos, la máquina de estados, permisos, migraciones de esquema, dinero, seguridad}} |
| MEDIA | cruza la costura `{{SLICE_1}}` ↔ `{{SLICE_2}}` sin entrar en ninguna de esas |
| BAJA | vive en un solo slice, sin contrato nuevo ni persistencia nueva |

De ahí salen dos parámetros del playbook: la **plantilla** (mínima o extendida) y el **modo rápido**,
que exige cumplir **todas** estas condiciones a la vez: {{la lista de condiciones del modo rápido de
este proyecto — complejidad BAJA, un solo slice, uno o dos archivos, sin migración, sin tocar los
sistemas sensibles}}. Si falta una, no es rápido. Y por encima de **{{N}} criterios de aceptación no
se forja**: se propone partir el item, porque un item-monstruo no cierra nunca y su porcentaje no
significa nada.

Con varios requisitos, se agrupan en **clusters por acoplamiento** —la misma entidad, la misma
migración, el mismo endpoint, la misma pantalla, la misma costura— y se secuencian: primero el
cluster que define el contrato, después sus consumidores. **Cada cluster recorre las cinco fases**, y
eso es justamente lo que hace visible el cierre parcial en el tablero.

## Las cinco fases

Todo item recorre el mismo pipeline. El runner ejecuta **una fase por invocación**, actualiza el
estado y para; encadena solo mientras el panorama esté claro y los gates automáticos pasen.

| Fase | Produce | Gate |
|---|---|---|
| 1 · Entendimiento | `analisis.md` (feature/change) o `diagnostico.md` (fix) | Solo lectura de código. En un fix, la causa raíz va con evidencia `archivo:línea`, y se mide si el mismo defecto está en otros sitios aunque queden fuera de alcance. |
| 2 · Diseño | `plan.md` (+ el contrato entre capas si hay uno nuevo) | Las pruebas se escriben aquí y **deben fallar**: se corre el comando y **se cita la salida**. Una prueba que pasa antes del cambio no prueba nada. Sin el artefacto de la fase 1 la fase no arranca. |
| 3 · Implementación | `resultado.md`, con los comandos y su salida | Entra solo con `plan.md` y con las pruebas en rojo citadas. Al terminar, **guarda de alcance**: lo que aparezca en el diff y no esté en el plan se justifica por escrito o se revierte. |
| 4 · Verificación | `verificacion.md` | Cobertura del **100 % de los casos**, con el reporte de total, ejecutados, verdes, rojos y no ejecutados con su motivo. Veredicto **binario** por criterio, con evidencia ejecutada y citada. Un caso no corrido es un hueco que bloquea el cierre de su criterio. {{Y el gate propio de este proyecto: p. ej. si el item tocó interfaz, sin evidencia en pantalla real no cierra.}} |
| 5 · Cierre | Aprendizaje, autorevisión del diff y commit | Gate del 100 %: no se cierra por debajo sin desviación justificada y **aceptada explícitamente**. Un criterio en RIESGO se escala, no se cierra. Empujar y abrir PR piden OK del usuario **cada vez**. |

Las fases 1 y 2 se **especializan por tipo** —una feature diseña el contrato entre capas campo a
campo; un change parte del estado actual hacia el objetivo con no-regresión y reversión; un fix elige
el arreglo mínimo entre al menos dos alternativas y escribe la prueba que **captura el defecto**—.
Las fases 3, 4 y 5 son idénticas para los tres.

**Un verde solo cuenta si puede ponerse rojo.** La integridad de la prueba se comprueba deshaciendo
**el cambio de producción** —no la prueba— y volviendo a correr el mismo comando: si sigue verde, la
prueba no está midiendo el cambio y no es evidencia. Tampoco cuenta un verde con aserciones que no
puedan fallar.

### Cuando hay que retroceder

El retrabajo no se improvisa: se corrige en la **fase más superficial dueña del problema**. Un
defecto vuelve a implementación; un criterio que nunca se diseñó vuelve a diseño; un requisito malo
vuelve a entendimiento; un plan que no es implementable vuelve a **diseño** —no se hackea alrededor
del plan—; y un cambio de alcance obliga a **re-forjar**. Iterar dentro de una fase es automático
hasta tres vueltas; después se escala. Un retroceso significativo **para y pide autorización**, y
queda anotado en las métricas del item.

## La memoria de resume: `progreso.md` es un contrato

`progreso.md` es lo que permite **parar y continuar**. La forja lo crea, el runner lo actualiza al
terminar cada fase y el generador del sitio lo **parsea**. Ahí está la cabecera del item (tipo,
complejidad, rama, base, autor, resumen en prosa), el estado de cada fase, una fila por criterio de
aceptación con su veredicto y su evidencia, las métricas y el registro de actividad. El runner elige
qué fase correr leyendo su `siguiente paso`, y si una fase quedó a medias se anota el **checkpoint
exacto**: qué se hizo, qué archivos, qué falta. Cuesta dos líneas y ahorra media hora al retomar.

Cuatro encabezados son **contrato con el generador del sitio**: `## Fases`,
`## Criterios de aceptación`, `## Métricas` y `## Registro de actividad`. **Cambiar su texto rompe
las páginas de avances en silencio.** No hay error, no hay aviso: la sección deja de leerse y la
página se genera igual, solo que sin esa información — que es la forma más cara de fallar, porque el
tablero sigue pareciendo correcto. Por eso el chequeo de integridad valida que los cuatro estén, y
por eso la fila en `## Registro de actividad` es **obligatoria** en el gate de fase: es el único dato
que no alimenta ningún número, así que es lo primero que se sacrifica con prisa, y sin él el tablero
prometería un log que no existe.

Del mismo lado del contrato: el HTML del sitio es **generado**. La fuente es `.work/`, `docs/` y las
páginas de `paginas/`; un retoque directo al HTML se pierde en el siguiente render, sin avisar.

## El bucle de aprendizaje: dos barras a propósito

En el cierre de cada item, lo aprendido vuelve a la documentación por **dos caminos con exigencias
distintas**. No es una inconsistencia: es el diseño.

| | Barra | Quién decide | Dónde entra |
|---|---|---|---|
| **Patrón** (técnica reutilizable) | **Alta** | El agente **redacta un borrador y lo presenta**. Nunca escribe sin aprobación humana | `docs/<slice>/`, con su fila en el índice y su columna «Cargar cuando…» **en el mismo cambio** |
| **Lección** (tropiezo no obvio) | **Baja** | El agente la **anexa solo**, tras comprobar que no exista una equivalente | `docs/lecciones.md`, con su identificador y su fila en el índice |

**Por qué son distintas.** Los dos artefactos no se consumen igual. Una lección se lee cuando alguien
la busca, y su coste de equivocarse es bajo: sobra una entrada en una lista. Un patrón, en cambio, lo
carga el meta-skill **a ciegas** —porque su trigger emparejó— y el agente lo aplica con confianza sin
tener forma de saber si venía a cuento. Un patrón mediocre no queda ignorado en un rincón: se aplica
en todos los items que emparejen con su trigger, y contamina el desarrollo desde dentro.

De ahí la asimetría: **la barra baja hace que la memoria crezca a diario; la barra alta mantiene la
biblioteca digna de cargarse a ciegas.** Un umbral único rompería una de las dos cosas —o la memoria
deja de crecer porque cada anotación necesita una reunión, o la biblioteca se llena de material que
el motor de selección va a servir con la misma autoridad que lo verificado—.

El puente entre ambas existe: una lección **repetida o generalizable se propone como patrón**, y
entonces pasa por la barra alta como cualquier otro. Y cuando un item no encuentra **ningún** trigger
que empareje, no se inventa un patrón ni se cargan documentos «de contexto»: se registra que la
selección quedó vacía, se trabaja desde la arquitectura general y el código, y ese item queda como
**candidato a proponer un patrón nuevo** en el cierre.

## El porcentaje es evidencia, no tareas

**El % de un item = criterios de aceptación en `CUMPLE` / total de criterios.** No es tareas
cerradas, no es fases superadas y no es cobertura de código —la cobertura es una señal **secundaria**
que no define nada—.

Un criterio pasa a `CUMPLE` **solo con evidencia ejecutada y citada**: el comando con su salida, o
`archivo:línea`. **Sin evidencia no es `CUMPLE`**, y el veredicto es binario: comportamiento,
mensajes y límites se comparan carácter por carácter, y una diferencia es NO CUMPLE, no «casi». Los
criterios que no se pudieron verificar se marcan como riesgo y **se escalan**; los que necesitaron
validación humana bajan la confianza del item de `auto` a `confirmado`.

El porcentaje del tablero **se deriva de esa tabla, no se lee de un número escrito a mano**. La
consecuencia práctica es la que importa: un item al 60 % significa que seis de cada diez criterios
tienen una prueba que se corrió y cuya salida está citada — no que se hayan cerrado seis tarjetas.

---

_Fuente de esta página: `.claude/config-proyecto.md` §9, §10, §12, §13, §14 y §16 ·
`.claude/skills/forjar-skill/SKILL.md` · `.claude/skills/desarrollar/SKILL.md` ·
`.claude/skills/forjar-skill/plantillas/progreso.md` · `docs/index.md`._
